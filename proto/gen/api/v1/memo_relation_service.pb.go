// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.36.5
// 	protoc        (unknown)
// source: api/v1/memo_relation_service.proto

package apiv1

import (
	_ "google.golang.org/genproto/googleapis/api/annotations"
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
	unsafe "unsafe"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type MemoRelation_Type int32

const (
	MemoRelation_TYPE_UNSPECIFIED MemoRelation_Type = 0
	MemoRelation_REFERENCE        MemoRelation_Type = 1
	MemoRelation_COMMENT          MemoRelation_Type = 2
)

// Enum value maps for MemoRelation_Type.
var (
	MemoRelation_Type_name = map[int32]string{
		0: "TYPE_UNSPECIFIED",
		1: "REFERENCE",
		2: "COMMENT",
	}
	MemoRelation_Type_value = map[string]int32{
		"TYPE_UNSPECIFIED": 0,
		"REFERENCE":        1,
		"COMMENT":          2,
	}
)

func (x MemoRelation_Type) Enum() *MemoRelation_Type {
	p := new(MemoRelation_Type)
	*p = x
	return p
}

func (x MemoRelation_Type) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (MemoRelation_Type) Descriptor() protoreflect.EnumDescriptor {
	return file_api_v1_memo_relation_service_proto_enumTypes[0].Descriptor()
}

func (MemoRelation_Type) Type() protoreflect.EnumType {
	return &file_api_v1_memo_relation_service_proto_enumTypes[0]
}

func (x MemoRelation_Type) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use MemoRelation_Type.Descriptor instead.
func (MemoRelation_Type) EnumDescriptor() ([]byte, []int) {
	return file_api_v1_memo_relation_service_proto_rawDescGZIP(), []int{0, 0}
}

type MemoRelation struct {
	state protoimpl.MessageState `protogen:"open.v1"`
	// The name of memo.
	// Format: "memos/{uid}"
	Memo *MemoRelation_Memo `protobuf:"bytes,1,opt,name=memo,proto3" json:"memo,omitempty"`
	// The name of related memo.
	// Format: "memos/{uid}"
	RelatedMemo   *MemoRelation_Memo `protobuf:"bytes,2,opt,name=related_memo,json=relatedMemo,proto3" json:"related_memo,omitempty"`
	Type          MemoRelation_Type  `protobuf:"varint,3,opt,name=type,proto3,enum=memos.api.v1.MemoRelation_Type" json:"type,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *MemoRelation) Reset() {
	*x = MemoRelation{}
	mi := &file_api_v1_memo_relation_service_proto_msgTypes[0]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *MemoRelation) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*MemoRelation) ProtoMessage() {}

func (x *MemoRelation) ProtoReflect() protoreflect.Message {
	mi := &file_api_v1_memo_relation_service_proto_msgTypes[0]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use MemoRelation.ProtoReflect.Descriptor instead.
func (*MemoRelation) Descriptor() ([]byte, []int) {
	return file_api_v1_memo_relation_service_proto_rawDescGZIP(), []int{0}
}

func (x *MemoRelation) GetMemo() *MemoRelation_Memo {
	if x != nil {
		return x.Memo
	}
	return nil
}

func (x *MemoRelation) GetRelatedMemo() *MemoRelation_Memo {
	if x != nil {
		return x.RelatedMemo
	}
	return nil
}

func (x *MemoRelation) GetType() MemoRelation_Type {
	if x != nil {
		return x.Type
	}
	return MemoRelation_TYPE_UNSPECIFIED
}

type MemoRelation_Memo struct {
	state protoimpl.MessageState `protogen:"open.v1"`
	// The name of the memo.
	// Format: memos/{id}
	Name string `protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`
	Uid  string `protobuf:"bytes,2,opt,name=uid,proto3" json:"uid,omitempty"`
	// The snippet of the memo content. Plain text only.
	Snippet       string `protobuf:"bytes,3,opt,name=snippet,proto3" json:"snippet,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *MemoRelation_Memo) Reset() {
	*x = MemoRelation_Memo{}
	mi := &file_api_v1_memo_relation_service_proto_msgTypes[1]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *MemoRelation_Memo) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*MemoRelation_Memo) ProtoMessage() {}

func (x *MemoRelation_Memo) ProtoReflect() protoreflect.Message {
	mi := &file_api_v1_memo_relation_service_proto_msgTypes[1]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use MemoRelation_Memo.ProtoReflect.Descriptor instead.
func (*MemoRelation_Memo) Descriptor() ([]byte, []int) {
	return file_api_v1_memo_relation_service_proto_rawDescGZIP(), []int{0, 0}
}

func (x *MemoRelation_Memo) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

func (x *MemoRelation_Memo) GetUid() string {
	if x != nil {
		return x.Uid
	}
	return ""
}

func (x *MemoRelation_Memo) GetSnippet() string {
	if x != nil {
		return x.Snippet
	}
	return ""
}

var File_api_v1_memo_relation_service_proto protoreflect.FileDescriptor

var file_api_v1_memo_relation_service_proto_rawDesc = string([]byte{
	0x0a, 0x22, 0x61, 0x70, 0x69, 0x2f, 0x76, 0x31, 0x2f, 0x6d, 0x65, 0x6d, 0x6f, 0x5f, 0x72, 0x65,
	0x6c, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x5f, 0x73, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x2e, 0x70,
	0x72, 0x6f, 0x74, 0x6f, 0x12, 0x0c, 0x6d, 0x65, 0x6d, 0x6f, 0x73, 0x2e, 0x61, 0x70, 0x69, 0x2e,
	0x76, 0x31, 0x1a, 0x1f, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2f, 0x61, 0x70, 0x69, 0x2f, 0x66,
	0x69, 0x65, 0x6c, 0x64, 0x5f, 0x62, 0x65, 0x68, 0x61, 0x76, 0x69, 0x6f, 0x72, 0x2e, 0x70, 0x72,
	0x6f, 0x74, 0x6f, 0x22, 0xc4, 0x02, 0x0a, 0x0c, 0x4d, 0x65, 0x6d, 0x6f, 0x52, 0x65, 0x6c, 0x61,
	0x74, 0x69, 0x6f, 0x6e, 0x12, 0x33, 0x0a, 0x04, 0x6d, 0x65, 0x6d, 0x6f, 0x18, 0x01, 0x20, 0x01,
	0x28, 0x0b, 0x32, 0x1f, 0x2e, 0x6d, 0x65, 0x6d, 0x6f, 0x73, 0x2e, 0x61, 0x70, 0x69, 0x2e, 0x76,
	0x31, 0x2e, 0x4d, 0x65, 0x6d, 0x6f, 0x52, 0x65, 0x6c, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x2e, 0x4d,
	0x65, 0x6d, 0x6f, 0x52, 0x04, 0x6d, 0x65, 0x6d, 0x6f, 0x12, 0x42, 0x0a, 0x0c, 0x72, 0x65, 0x6c,
	0x61, 0x74, 0x65, 0x64, 0x5f, 0x6d, 0x65, 0x6d, 0x6f, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0b, 0x32,
	0x1f, 0x2e, 0x6d, 0x65, 0x6d, 0x6f, 0x73, 0x2e, 0x61, 0x70, 0x69, 0x2e, 0x76, 0x31, 0x2e, 0x4d,
	0x65, 0x6d, 0x6f, 0x52, 0x65, 0x6c, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x2e, 0x4d, 0x65, 0x6d, 0x6f,
	0x52, 0x0b, 0x72, 0x65, 0x6c, 0x61, 0x74, 0x65, 0x64, 0x4d, 0x65, 0x6d, 0x6f, 0x12, 0x33, 0x0a,
	0x04, 0x74, 0x79, 0x70, 0x65, 0x18, 0x03, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x1f, 0x2e, 0x6d, 0x65,
	0x6d, 0x6f, 0x73, 0x2e, 0x61, 0x70, 0x69, 0x2e, 0x76, 0x31, 0x2e, 0x4d, 0x65, 0x6d, 0x6f, 0x52,
	0x65, 0x6c, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x2e, 0x54, 0x79, 0x70, 0x65, 0x52, 0x04, 0x74, 0x79,
	0x70, 0x65, 0x1a, 0x4c, 0x0a, 0x04, 0x4d, 0x65, 0x6d, 0x6f, 0x12, 0x12, 0x0a, 0x04, 0x6e, 0x61,
	0x6d, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x12, 0x10,
	0x0a, 0x03, 0x75, 0x69, 0x64, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x03, 0x75, 0x69, 0x64,
	0x12, 0x1e, 0x0a, 0x07, 0x73, 0x6e, 0x69, 0x70, 0x70, 0x65, 0x74, 0x18, 0x03, 0x20, 0x01, 0x28,
	0x09, 0x42, 0x04, 0xe2, 0x41, 0x01, 0x03, 0x52, 0x07, 0x73, 0x6e, 0x69, 0x70, 0x70, 0x65, 0x74,
	0x22, 0x38, 0x0a, 0x04, 0x54, 0x79, 0x70, 0x65, 0x12, 0x14, 0x0a, 0x10, 0x54, 0x59, 0x50, 0x45,
	0x5f, 0x55, 0x4e, 0x53, 0x50, 0x45, 0x43, 0x49, 0x46, 0x49, 0x45, 0x44, 0x10, 0x00, 0x12, 0x0d,
	0x0a, 0x09, 0x52, 0x45, 0x46, 0x45, 0x52, 0x45, 0x4e, 0x43, 0x45, 0x10, 0x01, 0x12, 0x0b, 0x0a,
	0x07, 0x43, 0x4f, 0x4d, 0x4d, 0x45, 0x4e, 0x54, 0x10, 0x02, 0x42, 0xb0, 0x01, 0x0a, 0x10, 0x63,
	0x6f, 0x6d, 0x2e, 0x6d, 0x65, 0x6d, 0x6f, 0x73, 0x2e, 0x61, 0x70, 0x69, 0x2e, 0x76, 0x31, 0x42,
	0x18, 0x4d, 0x65, 0x6d, 0x6f, 0x52, 0x65, 0x6c, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x53, 0x65, 0x72,
	0x76, 0x69, 0x63, 0x65, 0x50, 0x72, 0x6f, 0x74, 0x6f, 0x50, 0x01, 0x5a, 0x30, 0x67, 0x69, 0x74,
	0x68, 0x75, 0x62, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x75, 0x73, 0x65, 0x6d, 0x65, 0x6d, 0x6f, 0x73,
	0x2f, 0x6d, 0x65, 0x6d, 0x6f, 0x73, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x2f, 0x67, 0x65, 0x6e,
	0x2f, 0x61, 0x70, 0x69, 0x2f, 0x76, 0x31, 0x3b, 0x61, 0x70, 0x69, 0x76, 0x31, 0xa2, 0x02, 0x03,
	0x4d, 0x41, 0x58, 0xaa, 0x02, 0x0c, 0x4d, 0x65, 0x6d, 0x6f, 0x73, 0x2e, 0x41, 0x70, 0x69, 0x2e,
	0x56, 0x31, 0xca, 0x02, 0x0c, 0x4d, 0x65, 0x6d, 0x6f, 0x73, 0x5c, 0x41, 0x70, 0x69, 0x5c, 0x56,
	0x31, 0xe2, 0x02, 0x18, 0x4d, 0x65, 0x6d, 0x6f, 0x73, 0x5c, 0x41, 0x70, 0x69, 0x5c, 0x56, 0x31,
	0x5c, 0x47, 0x50, 0x42, 0x4d, 0x65, 0x74, 0x61, 0x64, 0x61, 0x74, 0x61, 0xea, 0x02, 0x0e, 0x4d,
	0x65, 0x6d, 0x6f, 0x73, 0x3a, 0x3a, 0x41, 0x70, 0x69, 0x3a, 0x3a, 0x56, 0x31, 0x62, 0x06, 0x70,
	0x72, 0x6f, 0x74, 0x6f, 0x33,
})

var (
	file_api_v1_memo_relation_service_proto_rawDescOnce sync.Once
	file_api_v1_memo_relation_service_proto_rawDescData []byte
)

func file_api_v1_memo_relation_service_proto_rawDescGZIP() []byte {
	file_api_v1_memo_relation_service_proto_rawDescOnce.Do(func() {
		file_api_v1_memo_relation_service_proto_rawDescData = protoimpl.X.CompressGZIP(unsafe.Slice(unsafe.StringData(file_api_v1_memo_relation_service_proto_rawDesc), len(file_api_v1_memo_relation_service_proto_rawDesc)))
	})
	return file_api_v1_memo_relation_service_proto_rawDescData
}

var file_api_v1_memo_relation_service_proto_enumTypes = make([]protoimpl.EnumInfo, 1)
var file_api_v1_memo_relation_service_proto_msgTypes = make([]protoimpl.MessageInfo, 2)
var file_api_v1_memo_relation_service_proto_goTypes = []any{
	(MemoRelation_Type)(0),    // 0: memos.api.v1.MemoRelation.Type
	(*MemoRelation)(nil),      // 1: memos.api.v1.MemoRelation
	(*MemoRelation_Memo)(nil), // 2: memos.api.v1.MemoRelation.Memo
}
var file_api_v1_memo_relation_service_proto_depIdxs = []int32{
	2, // 0: memos.api.v1.MemoRelation.memo:type_name -> memos.api.v1.MemoRelation.Memo
	2, // 1: memos.api.v1.MemoRelation.related_memo:type_name -> memos.api.v1.MemoRelation.Memo
	0, // 2: memos.api.v1.MemoRelation.type:type_name -> memos.api.v1.MemoRelation.Type
	3, // [3:3] is the sub-list for method output_type
	3, // [3:3] is the sub-list for method input_type
	3, // [3:3] is the sub-list for extension type_name
	3, // [3:3] is the sub-list for extension extendee
	0, // [0:3] is the sub-list for field type_name
}

func init() { file_api_v1_memo_relation_service_proto_init() }
func file_api_v1_memo_relation_service_proto_init() {
	if File_api_v1_memo_relation_service_proto != nil {
		return
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: unsafe.Slice(unsafe.StringData(file_api_v1_memo_relation_service_proto_rawDesc), len(file_api_v1_memo_relation_service_proto_rawDesc)),
			NumEnums:      1,
			NumMessages:   2,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_api_v1_memo_relation_service_proto_goTypes,
		DependencyIndexes: file_api_v1_memo_relation_service_proto_depIdxs,
		EnumInfos:         file_api_v1_memo_relation_service_proto_enumTypes,
		MessageInfos:      file_api_v1_memo_relation_service_proto_msgTypes,
	}.Build()
	File_api_v1_memo_relation_service_proto = out.File
	file_api_v1_memo_relation_service_proto_goTypes = nil
	file_api_v1_memo_relation_service_proto_depIdxs = nil
}
