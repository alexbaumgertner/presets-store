"use client";

import { useState } from "react";
import { Button, Form, Input, InputNumber, Select, Switch, Upload, message } from "antd";

const processors = ["Helix", "Kemper", "Quad Cortex", "Neural DSP", "Axe-Fx"];

export function NewPresetForm() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: Record<string, unknown>) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", String(values.title ?? ""));
      formData.append("description", String(values.description ?? ""));
      formData.append("processorType", String(values.processorType ?? ""));
      formData.append("price", String(values.price ?? 0));
      formData.append("isPublished", String(Boolean(values.isPublished)));
      // tags may be an array from Select mode="tags"
      formData.append("tags", JSON.stringify(values.tags ?? []));

      // Antd Upload returns an UploadFile object; use originFileObj which is the real File
      const presetFile = (values as any).presetFile?.originFileObj;
      const previewAudio = (values as any).previewAudio?.originFileObj;
      const coverImage = (values as any).coverImage?.originFileObj;
      formData.append("previewVideoUrl", String(values.previewVideoUrl ?? "").trim());
      if (presetFile) formData.append("presetFile", presetFile);
      if (previewAudio) formData.append("previewAudio", previewAudio);
      if (coverImage) formData.append("coverImage", coverImage);

      const res = await fetch("/api/presets", { method: "POST", body: formData });
      const data = await res.json();
      if (!data.success) return message.error(data.error || "Failed to create preset");
      message.success("Preset created");
    } catch (err: any) {
      message.error(err?.message || "Failed to create preset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description" rules={[{ required: false }]}>
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item name="processorType" label="Processor type" rules={[{ required: true }]}>
        <Select options={processors.map((p) => ({ label: p, value: p }))} />
      </Form.Item>
      <Form.Item name="tags" label="Tags" rules={[{ required: false }]}>
        <Select mode="tags" />
      </Form.Item>
      <Form.Item name="price" label="Price (USD)" rules={[{ required: true }]}>
        <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="presetFile"
        label="Preset file"
        valuePropName="file"
        getValueFromEvent={(e) => e?.fileList?.[0]}
        rules={[{ required: true }]}
      >
        <Upload maxCount={1} beforeUpload={() => false}>
          <Button>Select preset file</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name="previewAudio"
        label="Preview audio"
        valuePropName="file"
        getValueFromEvent={(e) => e?.fileList?.[0]}
        rules={[{ required: false }]}
      >
        <Upload maxCount={1} beforeUpload={() => false}>
          <Button>Select preview audio</Button>
        </Upload>
      </Form.Item>
      <Form.Item name="previewVideoUrl" label="Preview video URL (YouTube)" rules={[{ required: false }]}>
        <Input placeholder="https://www.youtube.com/watch?v=..." />
      </Form.Item>
      <Form.Item
        name="coverImage"
        label="Cover image"
        valuePropName="file"
        getValueFromEvent={(e) => e?.fileList?.[0]}
        rules={[{ required: false }]}
      >
        <Upload maxCount={1} beforeUpload={() => false}>
          <Button>Select cover image</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name="isPublished"
        label="Publish now"
        valuePropName="checked"
        initialValue={false}
      >
        <Switch />
      </Form.Item>
      <Button loading={loading} type="primary" htmlType="submit">
        Create preset
      </Button>
    </Form>
  );
}
