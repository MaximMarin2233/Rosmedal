import React, { useEffect, useState } from 'react';

import QRCode from 'qrcode';

interface QRCodeProps {
  url: string; // URL или текст для кодирования
}

const QRCodeComponent: React.FC<QRCodeProps> = ({ url }) => {
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    QRCode.toString(
      url,
      {
        type: 'svg', // Генерируем SVG 
        width: 60,   // Размер QR-кода
        margin: 2,   // Поля вокруг кода
      },
      (error, svg) => {
        if (error) {
          console.error('Error generating QR Code:', error);
        } else {
          setSvgContent(svg); // Устанавливаем содержимое SVG
        }
      }
    );
  }, [url]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: svgContent }}
      style={{ display: 'inline-block', lineHeight: 0 }} // Убираем отступы вокруг SVG
    />
  );
};

export default QRCodeComponent;
