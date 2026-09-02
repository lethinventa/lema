import { Navigate, Route, Routes } from 'react-router-dom'
import { CalendarScreen } from './prototype/calendar/CalendarScreen'
import { PhoneFrame } from './prototype/components/PhoneFrame'
import { AccountDetailScreen } from './prototype/finance/AccountDetailScreen'
import { AccountsScreen } from './prototype/finance/AccountsScreen'
import { CardDetailScreen } from './prototype/finance/CardDetailScreen'
import { FinanceScreen } from './prototype/finance/FinanceScreen'
import { GoalsScreen } from './prototype/goals/GoalsScreen'
import { HomeScreen } from './prototype/home/HomeScreen'
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
import { DeleteAccountScreen } from './prototype/profile/DeleteAccountScreen'
import { ProfileHubScreen } from './prototype/profile/ProfileHubScreen'
import { SecurityScreen } from './prototype/profile/SecurityScreen'
import { OnboardingProvider } from './prototype/state/OnboardingContext'
import { TasksScreen } from './prototype/tasks/TasksScreen'

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
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/home/tarefas" element={<TasksScreen />} />
          <Route path="/home/calendario" element={<CalendarScreen />} />
          <Route path="/home/objetivos" element={<GoalsScreen />} />
          <Route path="/home/financas" element={<FinanceScreen />} />
          <Route path="/home/financas/contas" element={<AccountsScreen />} />
          <Route path="/home/financas/contas/:accountId" element={<AccountDetailScreen />} />
          <Route path="/home/financas/cartoes/:accountId" element={<CardDetailScreen />} />
          <Route path="/perfil" element={<ProfileHubScreen />} />
          <Route path="/perfil/seguranca" element={<SecurityScreen />} />
          <Route path="/perfil/excluir" element={<DeleteAccountScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PhoneFrame>
    </OnboardingProvider>
  )
}
