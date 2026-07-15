import { SignIn } from '@clerk/clerk-react';

export default function OnboardingPage() {
  return (
    <div className="onboarding">
      <div className="onboarding__hero">
        <div className="onboarding__icon" aria-hidden="true">📸</div>
        <h1 className="onboarding__title">RetratofitIA</h1>
        <p className="onboarding__sub">
          Acompanhe sua evolução corporal com inteligência artificial
        </p>
      </div>

      <div className="onboarding__auth">
        <SignIn
          routing="hash"
          appearance={{
            variables: {
              colorBackground: '#1e293b',
              colorText: '#f8fafc',
              colorPrimary: '#22c55e',
              colorInputBackground: '#0f172a',
              colorInputText: '#f8fafc',
              colorTextSecondary: '#94a3b8',
              borderRadius: '12px',
            },
            elements: {
              card: { boxShadow: 'none', border: '1px solid #334155' },
              footer: { background: '#1e293b' },
            },
          }}
        />
      </div>
    </div>
  );
}
