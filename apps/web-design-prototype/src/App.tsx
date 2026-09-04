import { Navigate, Route, Routes } from 'react-router-dom'
import { CalendarScreen } from './prototype/calendar/CalendarScreen'
import { EventDetailScreen } from './prototype/calendar/EventDetailScreen'
import { EventFormScreen } from './prototype/calendar/EventFormScreen'
import { PhoneFrame } from './prototype/components/PhoneFrame'
import { AccountDetailScreen } from './prototype/finance/AccountDetailScreen'
import { AccountsScreen } from './prototype/finance/AccountsScreen'
import { CardDetailScreen } from './prototype/finance/CardDetailScreen'
import { FinanceScreen } from './prototype/finance/FinanceScreen'
import { TransactionDetailScreen } from './prototype/finance/TransactionDetailScreen'
import { TransactionFormScreen } from './prototype/finance/TransactionFormScreen'
import { GoalDetailScreen } from './prototype/goals/GoalDetailScreen'
import { GoalFormScreen } from './prototype/goals/GoalFormScreen'
import { GoalsScreen } from './prototype/goals/GoalsScreen'
import { CreateGroupScreen } from './prototype/groups/CreateGroupScreen'
import { GroupFinanceScreen } from './prototype/groups/GroupFinanceScreen'
import { MembersScreen } from './prototype/groups/MembersScreen'
import { HomeScreen } from './prototype/home/HomeScreen'
import { DoneScreen } from './prototype/onboarding/DoneScreen'
import { FinancialSetupScreen } from './prototype/onboarding/FinancialSetupScreen'
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
import { TaskDetailScreen } from './prototype/tasks/TaskDetailScreen'
import { TaskFormScreen } from './prototype/tasks/TaskFormScreen'
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
          <Route path="/onboarding/financeiro-pessoal" element={<FinancialSetupScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/home/tarefas" element={<TasksScreen />} />
          <Route path="/home/tarefas/nova" element={<TaskFormScreen />} />
          <Route path="/home/tarefas/:taskId" element={<TaskDetailScreen />} />
          <Route path="/home/tarefas/:taskId/editar" element={<TaskFormScreen />} />
          <Route path="/home/calendario" element={<CalendarScreen />} />
          <Route path="/home/calendario/novo" element={<EventFormScreen />} />
          <Route path="/home/calendario/:eventId" element={<EventDetailScreen />} />
          <Route path="/home/calendario/:eventId/editar" element={<EventFormScreen />} />
          <Route path="/home/objetivos" element={<GoalsScreen />} />
          <Route path="/home/objetivos/novo" element={<GoalFormScreen />} />
          <Route path="/home/objetivos/:goalId" element={<GoalDetailScreen />} />
          <Route path="/home/objetivos/:goalId/editar" element={<GoalFormScreen />} />
          <Route path="/home/financas" element={<FinanceScreen />} />
          <Route path="/home/financas/nova" element={<TransactionFormScreen />} />
          <Route path="/home/financas/:txId" element={<TransactionDetailScreen />} />
          <Route path="/home/financas/:txId/editar" element={<TransactionFormScreen />} />
          <Route path="/home/financas/contas" element={<AccountsScreen />} />
          <Route path="/home/financas/contas/:accountId" element={<AccountDetailScreen />} />
          <Route path="/home/financas/cartoes/:accountId" element={<CardDetailScreen />} />
          <Route path="/perfil" element={<ProfileHubScreen />} />
          <Route path="/perfil/grupos/novo" element={<CreateGroupScreen />} />
          <Route path="/perfil/grupos/:groupId" element={<MembersScreen />} />
          <Route path="/perfil/grupos/:groupId/financas" element={<GroupFinanceScreen />} />
          <Route path="/perfil/seguranca" element={<SecurityScreen />} />
          <Route path="/perfil/excluir" element={<DeleteAccountScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PhoneFrame>
    </OnboardingProvider>
  )
}
