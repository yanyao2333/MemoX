package teststore

import (
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/require"

	"github.com/usememos/memos/store"

	storepb "github.com/usememos/memos/proto/gen/store"
)

func TestMemoStore(t *testing.T) {
	ctx := context.Background()
	ts := NewTestingStore(ctx, t)
	user, err := createTestingHostUser(ctx, ts)
	require.NoError(t, err)
	memoCreate := &store.Memo{
		UID:        "test-resource-name",
		CreatorID:  user.ID,
		Content:    "test_content",
		Visibility: store.Public,
	}
	memo, err := ts.CreateMemo(ctx, memoCreate)
	require.NoError(t, err)
	require.Equal(t, memoCreate.Content, memo.Content)
	memoPatchContent := "test_content_2"
	memoPatch := &store.UpdateMemo{
		ID:      memo.ID,
		Content: &memoPatchContent,
	}
	err = ts.UpdateMemo(ctx, memoPatch)
	require.NoError(t, err)
	memo, err = ts.GetMemo(ctx, &store.FindMemo{
		ID: &memo.ID,
	})
	require.NoError(t, err)
	require.NotNil(t, memo)
	memoList, err := ts.ListMemos(ctx, &store.FindMemo{
		CreatorID: &user.ID,
	})
	require.NoError(t, err)
	require.Equal(t, 1, len(memoList))
	require.Equal(t, memo, memoList[0])
	err = ts.DeleteMemo(ctx, &store.DeleteMemo{
		ID: memo.ID,
	})
	require.NoError(t, err)
	memoList, err = ts.ListMemos(ctx, &store.FindMemo{
		CreatorID: &user.ID,
	})
	require.NoError(t, err)
	require.Equal(t, 0, len(memoList))

	memoList, err = ts.ListMemos(ctx, &store.FindMemo{
		CreatorID: &user.ID,
		VisibilityList: []store.Visibility{
			store.Public,
		},
	})
	require.NoError(t, err)
	require.Equal(t, 0, len(memoList))
	ts.Close()
}

func TestMemoListByTags(t *testing.T) {
	ctx := context.Background()
	ts := NewTestingStore(ctx, t)
	user, err := createTestingHostUser(ctx, ts)
	require.NoError(t, err)
	memoCreate := &store.Memo{
		UID:        "test-resource-name",
		CreatorID:  user.ID,
		Content:    "test_content",
		Visibility: store.Public,
		Payload: &storepb.MemoPayload{
			Tags: []string{"test_tag"},
		},
	}
	memo, err := ts.CreateMemo(ctx, memoCreate)
	require.NoError(t, err)
	require.Equal(t, memoCreate.Content, memo.Content)
	memo, err = ts.GetMemo(ctx, &store.FindMemo{
		ID: &memo.ID,
	})
	require.NoError(t, err)
	require.NotNil(t, memo)

	memoList, err := ts.ListMemos(ctx, &store.FindMemo{
		PayloadFind: &store.FindMemoPayload{
			TagSearch: []string{"test_tag"},
		},
	})
	require.NoError(t, err)
	require.Equal(t, 1, len(memoList))
	require.Equal(t, memo, memoList[0])
	ts.Close()
}

func TestDeleteMemoStore(t *testing.T) {
	ctx := context.Background()
	ts := NewTestingStore(ctx, t)
	user, err := createTestingHostUser(ctx, ts)
	require.NoError(t, err)
	memoCreate := &store.Memo{
		UID:        "test-resource-name",
		CreatorID:  user.ID,
		Content:    "test_content",
		Visibility: store.Public,
	}
	memo, err := ts.CreateMemo(ctx, memoCreate)
	require.NoError(t, err)
	require.Equal(t, memoCreate.Content, memo.Content)
	err = ts.DeleteMemo(ctx, &store.DeleteMemo{
		ID: memo.ID,
	})
	require.NoError(t, err)
	ts.Close()
}

func TestGetMemosFromPastMonths(t *testing.T) {
	ctx := context.Background()
	ts := NewTestingStore(ctx, t)
	user, err := createTestingHostUser(ctx, ts)
	require.NoError(t, err)

	// Create memos for different dates.
	now := time.Now()
	currentYear, currentMonth, currentDay := now.Date()

	// Counter for generating unique UIDs.
	uidCounter := 0

	// Helper function to create a memo with a unique UID.
	createMemo := func(year, month, day int) *store.Memo {
		uidCounter++
		createdTs := time.Date(year, time.Month(month), day, 12, 0, 0, 0, now.Location()).Unix()
		memoCreate := &store.Memo{
			UID:        fmt.Sprintf("test-resource-%d", uidCounter), // Generate unique UID.
			CreatorID:  user.ID,
			Content:    "test_content",
			Visibility: store.Public,
			CreatedTs:  createdTs,
		}
		memo, err := ts.CreateMemo(ctx, memoCreate)
		require.NoError(t, err)
		return memo
	}

	// Create memos for the current month, last month, and two months ago.
	createMemo(currentYear, int(currentMonth), currentDay)
	if currentMonth-1 > 0 {
		createMemo(currentYear, int(currentMonth)-1, currentDay)
	} else {
		createMemo(currentYear-1, 12, currentDay)
	}

	if currentMonth-2 > 0 {
		createMemo(currentYear, int(currentMonth)-2, currentDay)
	} else if currentMonth-2 == -1 {
		createMemo(currentYear-1, 11, currentDay)
	} else {
		createMemo(currentYear-1, 10, currentDay)
	}

	// Test cases
	tests := []struct {
		name      string
		n         int
		expectLen int
	}{
		{
			name:      "get memos from past 0 months",
			n:         0, // Should return all past months memos.
			expectLen: 3,
		},
		{
			name:      "get memos from past 1 months",
			n:         1,
			expectLen: 1, // current Month memo
		},
		{
			name:      "get memos from past 2 months",
			n:         2,
			expectLen: 2,
		},
		{
			name:      "get memos from past 3 months",
			n:         3,
			expectLen: 3, //all memos
		},
		{
			name:      "get memos from a month with an invalid day",
			n:         0, // Consider February 30th (invalid date)
			expectLen: 3,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			memos, err := ts.GetMemosFromPastMonths(ctx, user.ID, tc.n)
			require.NoError(t, err)

			//Check the returned memos' date
			for _, memo := range memos {
				memoCreatedTime := time.Unix(memo.CreatedTs, 0)
				memoYear, memoMonth, memoDay := memoCreatedTime.Date()

				require.Equal(t, currentDay, memoDay)

				if tc.n > 0 {
					// Calculate the expected month range based on 'n'.
					expectedMonthLowerBound := int(currentMonth) - tc.n + 1
					expectedYear := currentYear
					if expectedMonthLowerBound <= 0 {
						expectedMonthLowerBound += 12
						expectedYear--
					}
					if memoYear == expectedYear {
						require.GreaterOrEqual(t, int(memoMonth), expectedMonthLowerBound)
					} else if memoYear == expectedYear+1 { // The memo is from the previous year.
						require.LessOrEqual(t, int(memoMonth), expectedMonthLowerBound+12)
					} else {
						require.Fail(t, "memo year is not expected")
					}
				}
			}
		})
	}

	ts.Close()
}
