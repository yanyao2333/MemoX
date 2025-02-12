// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.5.1
// - protoc             (unknown)
// source: api/v1/memo_service.proto

package apiv1

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	emptypb "google.golang.org/protobuf/types/known/emptypb"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.64.0 or later.
const _ = grpc.SupportPackageIsVersion9

const (
	MemoService_CreateMemo_FullMethodName             = "/memos.api.v1.MemoService/CreateMemo"
	MemoService_ListMemos_FullMethodName              = "/memos.api.v1.MemoService/ListMemos"
	MemoService_GetMemo_FullMethodName                = "/memos.api.v1.MemoService/GetMemo"
	MemoService_GetMemoByUid_FullMethodName           = "/memos.api.v1.MemoService/GetMemoByUid"
	MemoService_UpdateMemo_FullMethodName             = "/memos.api.v1.MemoService/UpdateMemo"
	MemoService_DeleteMemo_FullMethodName             = "/memos.api.v1.MemoService/DeleteMemo"
	MemoService_RenameMemoTag_FullMethodName          = "/memos.api.v1.MemoService/RenameMemoTag"
	MemoService_DeleteMemoTag_FullMethodName          = "/memos.api.v1.MemoService/DeleteMemoTag"
	MemoService_SetMemoResources_FullMethodName       = "/memos.api.v1.MemoService/SetMemoResources"
	MemoService_ListMemoResources_FullMethodName      = "/memos.api.v1.MemoService/ListMemoResources"
	MemoService_SetMemoRelations_FullMethodName       = "/memos.api.v1.MemoService/SetMemoRelations"
	MemoService_ListMemoRelations_FullMethodName      = "/memos.api.v1.MemoService/ListMemoRelations"
	MemoService_CreateMemoComment_FullMethodName      = "/memos.api.v1.MemoService/CreateMemoComment"
	MemoService_ListMemoComments_FullMethodName       = "/memos.api.v1.MemoService/ListMemoComments"
	MemoService_ListMemoReactions_FullMethodName      = "/memos.api.v1.MemoService/ListMemoReactions"
	MemoService_UpsertMemoReaction_FullMethodName     = "/memos.api.v1.MemoService/UpsertMemoReaction"
	MemoService_DeleteMemoReaction_FullMethodName     = "/memos.api.v1.MemoService/DeleteMemoReaction"
	MemoService_GetMemosFromPastMonths_FullMethodName = "/memos.api.v1.MemoService/GetMemosFromPastMonths"
)

// MemoServiceClient is the client API for MemoService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type MemoServiceClient interface {
	// CreateMemo creates a memo.
	CreateMemo(ctx context.Context, in *CreateMemoRequest, opts ...grpc.CallOption) (*Memo, error)
	// ListMemos lists memos with pagination and filter.
	ListMemos(ctx context.Context, in *ListMemosRequest, opts ...grpc.CallOption) (*ListMemosResponse, error)
	// GetMemo gets a memo.
	GetMemo(ctx context.Context, in *GetMemoRequest, opts ...grpc.CallOption) (*Memo, error)
	// GetMemoByUid gets a memo by uid
	GetMemoByUid(ctx context.Context, in *GetMemoByUidRequest, opts ...grpc.CallOption) (*Memo, error)
	// UpdateMemo updates a memo.
	UpdateMemo(ctx context.Context, in *UpdateMemoRequest, opts ...grpc.CallOption) (*Memo, error)
	// DeleteMemo deletes a memo.
	DeleteMemo(ctx context.Context, in *DeleteMemoRequest, opts ...grpc.CallOption) (*emptypb.Empty, error)
	// RenameMemoTag renames a tag for a memo.
	RenameMemoTag(ctx context.Context, in *RenameMemoTagRequest, opts ...grpc.CallOption) (*emptypb.Empty, error)
	// DeleteMemoTag deletes a tag for a memo.
	DeleteMemoTag(ctx context.Context, in *DeleteMemoTagRequest, opts ...grpc.CallOption) (*emptypb.Empty, error)
	// SetMemoResources sets resources for a memo.
	SetMemoResources(ctx context.Context, in *SetMemoResourcesRequest, opts ...grpc.CallOption) (*emptypb.Empty, error)
	// ListMemoResources lists resources for a memo.
	ListMemoResources(ctx context.Context, in *ListMemoResourcesRequest, opts ...grpc.CallOption) (*ListMemoResourcesResponse, error)
	// SetMemoRelations sets relations for a memo.
	SetMemoRelations(ctx context.Context, in *SetMemoRelationsRequest, opts ...grpc.CallOption) (*emptypb.Empty, error)
	// ListMemoRelations lists relations for a memo.
	ListMemoRelations(ctx context.Context, in *ListMemoRelationsRequest, opts ...grpc.CallOption) (*ListMemoRelationsResponse, error)
	// CreateMemoComment creates a comment for a memo.
	CreateMemoComment(ctx context.Context, in *CreateMemoCommentRequest, opts ...grpc.CallOption) (*Memo, error)
	// ListMemoComments lists comments for a memo.
	ListMemoComments(ctx context.Context, in *ListMemoCommentsRequest, opts ...grpc.CallOption) (*ListMemoCommentsResponse, error)
	// ListMemoReactions lists reactions for a memo.
	ListMemoReactions(ctx context.Context, in *ListMemoReactionsRequest, opts ...grpc.CallOption) (*ListMemoReactionsResponse, error)
	// UpsertMemoReaction upserts a reaction for a memo.
	UpsertMemoReaction(ctx context.Context, in *UpsertMemoReactionRequest, opts ...grpc.CallOption) (*Reaction, error)
	// DeleteMemoReaction deletes a reaction for a memo.
	DeleteMemoReaction(ctx context.Context, in *DeleteMemoReactionRequest, opts ...grpc.CallOption) (*emptypb.Empty, error)
	// 「那月今日」功能 api
	GetMemosFromPastMonths(ctx context.Context, in *GetMemosFromPastMonthsRequest, opts ...grpc.CallOption) (*GetMemosFromPastMonthsResponse, error)
}

type memoServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewMemoServiceClient(cc grpc.ClientConnInterface) MemoServiceClient {
	return &memoServiceClient{cc}
}

func (c *memoServiceClient) CreateMemo(ctx context.Context, in *CreateMemoRequest, opts ...grpc.CallOption) (*Memo, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(Memo)
	err := c.cc.Invoke(ctx, MemoService_CreateMemo_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *memoServiceClient) ListMemos(ctx context.Context, in *ListMemosRequest, opts ...grpc.CallOption) (*ListMemosResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(ListMemosResponse)
	err := c.cc.Invoke(ctx, MemoService_ListMemos_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *memoServiceClient) GetMemo(ctx context.Context, in *GetMemoRequest, opts ...grpc.CallOption) (*Memo, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(Memo)
	err := c.cc.Invoke(ctx, MemoService_GetMemo_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *memoServiceClient) GetMemoByUid(ctx context.Context, in *GetMemoByUidRequest, opts ...grpc.CallOption) (*Memo, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(Memo)
	err := c.cc.Invoke(ctx, MemoService_GetMemoByUid_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *memoServiceClient) UpdateMemo(ctx context.Context, in *UpdateMemoRequest, opts ...grpc.CallOption) (*Memo, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(Memo)
	err := c.cc.Invoke(ctx, MemoService_UpdateMemo_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *memoServiceClient) DeleteMemo(ctx context.Context, in *DeleteMemoRequest, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, MemoService_DeleteMemo_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *memoServiceClient) RenameMemoTag(ctx context.Context, in *RenameMemoTagRequest, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, MemoService_RenameMemoTag_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *memoServiceClient) DeleteMemoTag(ctx context.Context, in *DeleteMemoTagRequest, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, MemoService_DeleteMemoTag_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *memoServiceClient) SetMemoResources(ctx context.Context, in *SetMemoResourcesRequest, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, MemoService_SetMemoResources_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *memoServiceClient) ListMemoResources(ctx context.Context, in *ListMemoResourcesRequest, opts ...grpc.CallOption) (*ListMemoResourcesResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(ListMemoResourcesResponse)
	err := c.cc.Invoke(ctx, MemoService_ListMemoResources_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *memoServiceClient) SetMemoRelations(ctx context.Context, in *SetMemoRelationsRequest, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, MemoService_SetMemoRelations_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *memoServiceClient) ListMemoRelations(ctx context.Context, in *ListMemoRelationsRequest, opts ...grpc.CallOption) (*ListMemoRelationsResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(ListMemoRelationsResponse)
	err := c.cc.Invoke(ctx, MemoService_ListMemoRelations_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *memoServiceClient) CreateMemoComment(ctx context.Context, in *CreateMemoCommentRequest, opts ...grpc.CallOption) (*Memo, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(Memo)
	err := c.cc.Invoke(ctx, MemoService_CreateMemoComment_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *memoServiceClient) ListMemoComments(ctx context.Context, in *ListMemoCommentsRequest, opts ...grpc.CallOption) (*ListMemoCommentsResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(ListMemoCommentsResponse)
	err := c.cc.Invoke(ctx, MemoService_ListMemoComments_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *memoServiceClient) ListMemoReactions(ctx context.Context, in *ListMemoReactionsRequest, opts ...grpc.CallOption) (*ListMemoReactionsResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(ListMemoReactionsResponse)
	err := c.cc.Invoke(ctx, MemoService_ListMemoReactions_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *memoServiceClient) UpsertMemoReaction(ctx context.Context, in *UpsertMemoReactionRequest, opts ...grpc.CallOption) (*Reaction, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(Reaction)
	err := c.cc.Invoke(ctx, MemoService_UpsertMemoReaction_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *memoServiceClient) DeleteMemoReaction(ctx context.Context, in *DeleteMemoReactionRequest, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, MemoService_DeleteMemoReaction_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *memoServiceClient) GetMemosFromPastMonths(ctx context.Context, in *GetMemosFromPastMonthsRequest, opts ...grpc.CallOption) (*GetMemosFromPastMonthsResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(GetMemosFromPastMonthsResponse)
	err := c.cc.Invoke(ctx, MemoService_GetMemosFromPastMonths_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// MemoServiceServer is the server API for MemoService service.
// All implementations must embed UnimplementedMemoServiceServer
// for forward compatibility.
type MemoServiceServer interface {
	// CreateMemo creates a memo.
	CreateMemo(context.Context, *CreateMemoRequest) (*Memo, error)
	// ListMemos lists memos with pagination and filter.
	ListMemos(context.Context, *ListMemosRequest) (*ListMemosResponse, error)
	// GetMemo gets a memo.
	GetMemo(context.Context, *GetMemoRequest) (*Memo, error)
	// GetMemoByUid gets a memo by uid
	GetMemoByUid(context.Context, *GetMemoByUidRequest) (*Memo, error)
	// UpdateMemo updates a memo.
	UpdateMemo(context.Context, *UpdateMemoRequest) (*Memo, error)
	// DeleteMemo deletes a memo.
	DeleteMemo(context.Context, *DeleteMemoRequest) (*emptypb.Empty, error)
	// RenameMemoTag renames a tag for a memo.
	RenameMemoTag(context.Context, *RenameMemoTagRequest) (*emptypb.Empty, error)
	// DeleteMemoTag deletes a tag for a memo.
	DeleteMemoTag(context.Context, *DeleteMemoTagRequest) (*emptypb.Empty, error)
	// SetMemoResources sets resources for a memo.
	SetMemoResources(context.Context, *SetMemoResourcesRequest) (*emptypb.Empty, error)
	// ListMemoResources lists resources for a memo.
	ListMemoResources(context.Context, *ListMemoResourcesRequest) (*ListMemoResourcesResponse, error)
	// SetMemoRelations sets relations for a memo.
	SetMemoRelations(context.Context, *SetMemoRelationsRequest) (*emptypb.Empty, error)
	// ListMemoRelations lists relations for a memo.
	ListMemoRelations(context.Context, *ListMemoRelationsRequest) (*ListMemoRelationsResponse, error)
	// CreateMemoComment creates a comment for a memo.
	CreateMemoComment(context.Context, *CreateMemoCommentRequest) (*Memo, error)
	// ListMemoComments lists comments for a memo.
	ListMemoComments(context.Context, *ListMemoCommentsRequest) (*ListMemoCommentsResponse, error)
	// ListMemoReactions lists reactions for a memo.
	ListMemoReactions(context.Context, *ListMemoReactionsRequest) (*ListMemoReactionsResponse, error)
	// UpsertMemoReaction upserts a reaction for a memo.
	UpsertMemoReaction(context.Context, *UpsertMemoReactionRequest) (*Reaction, error)
	// DeleteMemoReaction deletes a reaction for a memo.
	DeleteMemoReaction(context.Context, *DeleteMemoReactionRequest) (*emptypb.Empty, error)
	// 「那月今日」功能 api
	GetMemosFromPastMonths(context.Context, *GetMemosFromPastMonthsRequest) (*GetMemosFromPastMonthsResponse, error)
	mustEmbedUnimplementedMemoServiceServer()
}

// UnimplementedMemoServiceServer must be embedded to have
// forward compatible implementations.
//
// NOTE: this should be embedded by value instead of pointer to avoid a nil
// pointer dereference when methods are called.
type UnimplementedMemoServiceServer struct{}

func (UnimplementedMemoServiceServer) CreateMemo(context.Context, *CreateMemoRequest) (*Memo, error) {
	return nil, status.Errorf(codes.Unimplemented, "method CreateMemo not implemented")
}
func (UnimplementedMemoServiceServer) ListMemos(context.Context, *ListMemosRequest) (*ListMemosResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListMemos not implemented")
}
func (UnimplementedMemoServiceServer) GetMemo(context.Context, *GetMemoRequest) (*Memo, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetMemo not implemented")
}
func (UnimplementedMemoServiceServer) GetMemoByUid(context.Context, *GetMemoByUidRequest) (*Memo, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetMemoByUid not implemented")
}
func (UnimplementedMemoServiceServer) UpdateMemo(context.Context, *UpdateMemoRequest) (*Memo, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UpdateMemo not implemented")
}
func (UnimplementedMemoServiceServer) DeleteMemo(context.Context, *DeleteMemoRequest) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeleteMemo not implemented")
}
func (UnimplementedMemoServiceServer) RenameMemoTag(context.Context, *RenameMemoTagRequest) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method RenameMemoTag not implemented")
}
func (UnimplementedMemoServiceServer) DeleteMemoTag(context.Context, *DeleteMemoTagRequest) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeleteMemoTag not implemented")
}
func (UnimplementedMemoServiceServer) SetMemoResources(context.Context, *SetMemoResourcesRequest) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SetMemoResources not implemented")
}
func (UnimplementedMemoServiceServer) ListMemoResources(context.Context, *ListMemoResourcesRequest) (*ListMemoResourcesResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListMemoResources not implemented")
}
func (UnimplementedMemoServiceServer) SetMemoRelations(context.Context, *SetMemoRelationsRequest) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SetMemoRelations not implemented")
}
func (UnimplementedMemoServiceServer) ListMemoRelations(context.Context, *ListMemoRelationsRequest) (*ListMemoRelationsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListMemoRelations not implemented")
}
func (UnimplementedMemoServiceServer) CreateMemoComment(context.Context, *CreateMemoCommentRequest) (*Memo, error) {
	return nil, status.Errorf(codes.Unimplemented, "method CreateMemoComment not implemented")
}
func (UnimplementedMemoServiceServer) ListMemoComments(context.Context, *ListMemoCommentsRequest) (*ListMemoCommentsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListMemoComments not implemented")
}
func (UnimplementedMemoServiceServer) ListMemoReactions(context.Context, *ListMemoReactionsRequest) (*ListMemoReactionsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListMemoReactions not implemented")
}
func (UnimplementedMemoServiceServer) UpsertMemoReaction(context.Context, *UpsertMemoReactionRequest) (*Reaction, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UpsertMemoReaction not implemented")
}
func (UnimplementedMemoServiceServer) DeleteMemoReaction(context.Context, *DeleteMemoReactionRequest) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeleteMemoReaction not implemented")
}
func (UnimplementedMemoServiceServer) GetMemosFromPastMonths(context.Context, *GetMemosFromPastMonthsRequest) (*GetMemosFromPastMonthsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetMemosFromPastMonths not implemented")
}
func (UnimplementedMemoServiceServer) mustEmbedUnimplementedMemoServiceServer() {}
func (UnimplementedMemoServiceServer) testEmbeddedByValue()                     {}

// UnsafeMemoServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to MemoServiceServer will
// result in compilation errors.
type UnsafeMemoServiceServer interface {
	mustEmbedUnimplementedMemoServiceServer()
}

func RegisterMemoServiceServer(s grpc.ServiceRegistrar, srv MemoServiceServer) {
	// If the following call pancis, it indicates UnimplementedMemoServiceServer was
	// embedded by pointer and is nil.  This will cause panics if an
	// unimplemented method is ever invoked, so we test this at initialization
	// time to prevent it from happening at runtime later due to I/O.
	if t, ok := srv.(interface{ testEmbeddedByValue() }); ok {
		t.testEmbeddedByValue()
	}
	s.RegisterService(&MemoService_ServiceDesc, srv)
}

func _MemoService_CreateMemo_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CreateMemoRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MemoServiceServer).CreateMemo(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: MemoService_CreateMemo_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MemoServiceServer).CreateMemo(ctx, req.(*CreateMemoRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MemoService_ListMemos_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListMemosRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MemoServiceServer).ListMemos(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: MemoService_ListMemos_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MemoServiceServer).ListMemos(ctx, req.(*ListMemosRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MemoService_GetMemo_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetMemoRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MemoServiceServer).GetMemo(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: MemoService_GetMemo_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MemoServiceServer).GetMemo(ctx, req.(*GetMemoRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MemoService_GetMemoByUid_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetMemoByUidRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MemoServiceServer).GetMemoByUid(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: MemoService_GetMemoByUid_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MemoServiceServer).GetMemoByUid(ctx, req.(*GetMemoByUidRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MemoService_UpdateMemo_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UpdateMemoRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MemoServiceServer).UpdateMemo(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: MemoService_UpdateMemo_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MemoServiceServer).UpdateMemo(ctx, req.(*UpdateMemoRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MemoService_DeleteMemo_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(DeleteMemoRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MemoServiceServer).DeleteMemo(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: MemoService_DeleteMemo_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MemoServiceServer).DeleteMemo(ctx, req.(*DeleteMemoRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MemoService_RenameMemoTag_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(RenameMemoTagRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MemoServiceServer).RenameMemoTag(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: MemoService_RenameMemoTag_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MemoServiceServer).RenameMemoTag(ctx, req.(*RenameMemoTagRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MemoService_DeleteMemoTag_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(DeleteMemoTagRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MemoServiceServer).DeleteMemoTag(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: MemoService_DeleteMemoTag_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MemoServiceServer).DeleteMemoTag(ctx, req.(*DeleteMemoTagRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MemoService_SetMemoResources_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(SetMemoResourcesRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MemoServiceServer).SetMemoResources(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: MemoService_SetMemoResources_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MemoServiceServer).SetMemoResources(ctx, req.(*SetMemoResourcesRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MemoService_ListMemoResources_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListMemoResourcesRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MemoServiceServer).ListMemoResources(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: MemoService_ListMemoResources_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MemoServiceServer).ListMemoResources(ctx, req.(*ListMemoResourcesRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MemoService_SetMemoRelations_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(SetMemoRelationsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MemoServiceServer).SetMemoRelations(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: MemoService_SetMemoRelations_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MemoServiceServer).SetMemoRelations(ctx, req.(*SetMemoRelationsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MemoService_ListMemoRelations_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListMemoRelationsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MemoServiceServer).ListMemoRelations(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: MemoService_ListMemoRelations_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MemoServiceServer).ListMemoRelations(ctx, req.(*ListMemoRelationsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MemoService_CreateMemoComment_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CreateMemoCommentRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MemoServiceServer).CreateMemoComment(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: MemoService_CreateMemoComment_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MemoServiceServer).CreateMemoComment(ctx, req.(*CreateMemoCommentRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MemoService_ListMemoComments_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListMemoCommentsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MemoServiceServer).ListMemoComments(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: MemoService_ListMemoComments_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MemoServiceServer).ListMemoComments(ctx, req.(*ListMemoCommentsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MemoService_ListMemoReactions_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListMemoReactionsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MemoServiceServer).ListMemoReactions(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: MemoService_ListMemoReactions_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MemoServiceServer).ListMemoReactions(ctx, req.(*ListMemoReactionsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MemoService_UpsertMemoReaction_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UpsertMemoReactionRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MemoServiceServer).UpsertMemoReaction(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: MemoService_UpsertMemoReaction_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MemoServiceServer).UpsertMemoReaction(ctx, req.(*UpsertMemoReactionRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MemoService_DeleteMemoReaction_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(DeleteMemoReactionRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MemoServiceServer).DeleteMemoReaction(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: MemoService_DeleteMemoReaction_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MemoServiceServer).DeleteMemoReaction(ctx, req.(*DeleteMemoReactionRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _MemoService_GetMemosFromPastMonths_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetMemosFromPastMonthsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MemoServiceServer).GetMemosFromPastMonths(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: MemoService_GetMemosFromPastMonths_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MemoServiceServer).GetMemosFromPastMonths(ctx, req.(*GetMemosFromPastMonthsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// MemoService_ServiceDesc is the grpc.ServiceDesc for MemoService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var MemoService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "memos.api.v1.MemoService",
	HandlerType: (*MemoServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "CreateMemo",
			Handler:    _MemoService_CreateMemo_Handler,
		},
		{
			MethodName: "ListMemos",
			Handler:    _MemoService_ListMemos_Handler,
		},
		{
			MethodName: "GetMemo",
			Handler:    _MemoService_GetMemo_Handler,
		},
		{
			MethodName: "GetMemoByUid",
			Handler:    _MemoService_GetMemoByUid_Handler,
		},
		{
			MethodName: "UpdateMemo",
			Handler:    _MemoService_UpdateMemo_Handler,
		},
		{
			MethodName: "DeleteMemo",
			Handler:    _MemoService_DeleteMemo_Handler,
		},
		{
			MethodName: "RenameMemoTag",
			Handler:    _MemoService_RenameMemoTag_Handler,
		},
		{
			MethodName: "DeleteMemoTag",
			Handler:    _MemoService_DeleteMemoTag_Handler,
		},
		{
			MethodName: "SetMemoResources",
			Handler:    _MemoService_SetMemoResources_Handler,
		},
		{
			MethodName: "ListMemoResources",
			Handler:    _MemoService_ListMemoResources_Handler,
		},
		{
			MethodName: "SetMemoRelations",
			Handler:    _MemoService_SetMemoRelations_Handler,
		},
		{
			MethodName: "ListMemoRelations",
			Handler:    _MemoService_ListMemoRelations_Handler,
		},
		{
			MethodName: "CreateMemoComment",
			Handler:    _MemoService_CreateMemoComment_Handler,
		},
		{
			MethodName: "ListMemoComments",
			Handler:    _MemoService_ListMemoComments_Handler,
		},
		{
			MethodName: "ListMemoReactions",
			Handler:    _MemoService_ListMemoReactions_Handler,
		},
		{
			MethodName: "UpsertMemoReaction",
			Handler:    _MemoService_UpsertMemoReaction_Handler,
		},
		{
			MethodName: "DeleteMemoReaction",
			Handler:    _MemoService_DeleteMemoReaction_Handler,
		},
		{
			MethodName: "GetMemosFromPastMonths",
			Handler:    _MemoService_GetMemosFromPastMonths_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "api/v1/memo_service.proto",
}
