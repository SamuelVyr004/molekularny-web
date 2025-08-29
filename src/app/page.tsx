import fs from 'fs';
import path from 'path';

export default function HomePage() {
  const filePath = path.join(process.cwd(), 'public', 'index.html');
  const htmlContent = fs.readFileSync(filePath, 'utf-8');
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}