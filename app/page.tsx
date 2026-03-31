import versions, { VersionKey } from './home/versions';

const APP_VERSION = (process.env.NEXT_PUBLIC_APP_VERSION ?? 'VerZero') as VersionKey;

export default function Home() {
  const Version = versions[APP_VERSION] ?? versions.VerZero;

  return (
    <main>
      <Version />
    </main>
  );
}
