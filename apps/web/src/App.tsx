import { Navigate, Route, Routes } from 'react-router-dom'
import { PhoneFrame } from './prototype/components/PhoneFrame'
import { DoneScreen } from './prototype/onboarding/DoneScreen'
import { GroupChoiceScreen } from './prototype/onboarding/GroupChoiceScreen'
import { GroupCreateScreen } from './prototype/onboarding/GroupCreateScreen'
import { GroupFinanceMoneyScreen } from './prototype/onboarding/GroupFinanceMoneyScreen'
import { GroupFinanceSplitScreen } from './prototype/onboarding/GroupFinanceSplitScreen'
import { GroupFinanceTransparencyScreen } from './prototype/onboarding/GroupFinanceTransparencyScreen'
import { GroupJoinScreen } from './prototype/onboarding/GroupJoinScreen'
import { ProfileScreen } from './prototype/onboarding/ProfileScreen'
import { SignUpScreen } from './prototype/onboarding/SignUpScreen'
import { StartScreen } from './prototype/onboarding/StartScreen'
import { OnboardingProvider } from './prototype/state/OnboardingContext'

export default function App() {
  return (
    <OnboardingProvider>
      <PhoneFrame>
        <Routes>
          <Route path="/" element={<StartScreen />} />
          <Route path="/onboarding/sign-up" element={<SignUpScreen />} />
          <Route path="/onboarding/group" element={<GroupChoiceScreen />} />
          <Route path="/onboarding/group/create" element={<GroupCreateScreen />} />
          <Route path="/onboarding/group/join" element={<GroupJoinScreen />} />
          <Route path="/onboarding/profile" element={<ProfileScreen />} />
          <Route path="/onboarding/group-finance" element={<GroupFinanceMoneyScreen />} />
          <Route path="/onboarding/group-finance/split" element={<GroupFinanceSplitScreen />} />
          <Route path="/onboarding/group-finance/transparency" element={<GroupFinanceTransparencyScreen />} />
          <Route path="/onboarding/done" element={<DoneScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PhoneFrame>
    </OnboardingProvider>
  )
}
