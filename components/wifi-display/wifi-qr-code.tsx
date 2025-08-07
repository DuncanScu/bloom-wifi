import { QRCodeSVG } from "qrcode.react";
import { QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WiFiQRCodeProps {
  networkName: string;
  password: string;
  security?: "WPA" | "WEP" | "nopass";
  hidden?: boolean;
}

export function WiFiQRCode({
  networkName,
  password,
  security = "WPA",
  hidden = false,
}: WiFiQRCodeProps) {
  // Generate WiFi QR code string format
  // Format: WIFI:T:WPA;S:NetworkName;P:Password;H:false;;
  const generateWiFiString = () => {
    return `WIFI:T:${security};S:${networkName};P:${password};H:${hidden};;`;
  };

  const wifiString = generateWiFiString();

  return (
    <Card className="w-full">
      <CardHeader className="text-center pb-3">
        <CardTitle className="flex items-center justify-center gap-2 text-lg">
          <QrCode className="h-5 w-5" />
          Quick Connect
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center bg-white p-4 rounded-lg">
          <QRCodeSVG
            value={wifiString}
            size={200}
            level="M"
            includeMargin={true}
          />
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Point your camera at the QR code to connect automatically
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
