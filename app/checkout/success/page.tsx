import { Result, Button } from "antd";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <Result
      status="success"
      title="Payment successful"
      subTitle="Your preset is now available in your library."
      extra={[
        <Link href="/library" key="library"><Button type="primary">Go to library</Button></Link>,
        <Link href="/presets" key="presets"><Button>Browse more presets</Button></Link>
      ]}
    />
  );
}
