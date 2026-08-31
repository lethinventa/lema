import { Navigate, Route, Routes } from 'react-router-dom'
import { PhoneFrame } from './prototype/components/PhoneFrame'
import { StatusBadge } from './prototype/components/StatusBadge'
import { DoneScreen } from './prototype/onboarding/DoneScreen'
import { GroupChoiceScreen } from './prototype/onboarding/GroupChoiceScreen'
import { GroupCreateScreen } from './prototype/onboarding/GroupCreateScreen'
import { GroupFinanceScreen } from './prototype/onboarding/GroupFinanceScreen'
import { GroupJoinScreen } from './prototype/onboarding/GroupJoinScreen'
import { ProfileScreen } from './prototype/onboarding/ProfileScreen'
import { SignUpScreen } from './prototype/onboarding/SignUpScreen'
import { StartScreen } from './prototype/onboarding/StartScreen'
import { OnboardingProvider } from './prototype/state/OnboardingContext'

export default function App() {
  return (
    <OnboardingProvider>
      <PhoneFrame>
        <StatusBadge />
        <Routes>
          <Route path="/" element={<StartScreen />} />
          <Route path="/onboarding/sign-up" element={<SignUpScreen />} />
          <Route path="/onboarding/group" element={<GroupChoiceScreen />} />
          <Route path="/onboarding/group/create" element={<GroupCreateScreen />} />
          <Route path="/onboarding/group/join" element={<GroupJoinScreen />} />
          <Route path="/onboarding/profile" element={<ProfileScreen />} />
          <Route path="/onboarding/group-finance" element={<GroupFinanceScreen />} />
          <Route path="/onboarding/done" element={<DoneScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PhoneFrame>
    </OnboardingProvider>
  )
}
