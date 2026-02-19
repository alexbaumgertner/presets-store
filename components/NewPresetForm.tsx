"use client";

import { useState } from "react";
import { Button, Form, Input, InputNumber, Select, Switch, Upload, message } from "antd";

const processors = ["Helix", "Kemper", "Quad Cortex", "Neural DSP", "Axe-Fx"];

export function NewPresetForm() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: Record<string, unknown>) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "tags") {
          formData.append("tags", (value as string[]).join(","));
        } else if (key === "presetFile" || key === "previewAudio" || key === "coverImage") {
          const file = (value as { file: { originFileObj: File } }).file.originFileObj;
          formData.append(key, file);
        } else {
          formData.append(key, String(value));
        }
      });

      const res = await fetch("/api/presets", { method: "POST", body: formData });
      const data = await res.json();
      if (!data.success) return message.error(data.error || "Failed to create preset");
      message.success("Preset created");
      window.location.href = "/admin/presets";
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input /></Form.Item>
      <Form.Item name="description" label="Description" rules={[{ required: true }]}><Input.TextArea rows={4} /></Form.Item>
      <Form.Item name="processorType" label="Processor type" rules={[{ required: true }]}>
        <Select options={processors.map((p) => ({ label: p, value: p }))} />
      </Form.Item>
      <Form.Item name="tags" label="Tags" rules={[{ required: true }]}><Select mode="tags" /></Form.Item>
      <Form.Item name="price" label="Price (USD)" rules={[{ required: true }]}><InputNumber min={0} step={0.01} style={{ width: "100%" }} /></Form.Item>
      <Form.Item name="presetFile" label="Preset file" valuePropName="file" getValueFromEvent={(e) => e?.fileList?.[0]} rules={[{ required: true }]}>
        <Upload maxCount={1} beforeUpload={() => false}><Button>Select preset file</Button></Upload>
      </Form.Item>
      <Form.Item name="previewAudio" label="Preview audio" valuePropName="file" getValueFromEvent={(e) => e?.fileList?.[0]} rules={[{ required: true }]}>
        <Upload maxCount={1} beforeUpload={() => false}><Button>Select preview audio</Button></Upload>
      </Form.Item>
      <Form.Item name="coverImage" label="Cover image" valuePropName="file" getValueFromEvent={(e) => e?.fileList?.[0]} rules={[{ required: true }]}>
        <Upload maxCount={1} beforeUpload={() => false}><Button>Select cover image</Button></Upload>
      </Form.Item>
      <Form.Item name="isPublished" label="Publish now" valuePropName="checked" initialValue={false}><Switch /></Form.Item>
      <Button loading={loading} type="primary" htmlType="submit">Create preset</Button>
    </Form>
  );
}
