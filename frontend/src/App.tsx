
import { createBrowserRouter, RouterProvider } from "react-router";

import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Home from "./pages/landing/Home";
import About from "./pages/landing/About";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import NotFound from "./pages/shared/NotFound";
import Unauthorized from "./pages/shared/Unauthorized";
import Notifications from "./pages/shared/Notifications";

// Student
import SDashboard from "./pages/student/Dashboard";
import SAssessment from "./pages/student/Assessment";
import SSkillProfile from "./pages/student/SkillProfile";
import SSkillGap from "./pages/student/SkillGap";
import SRoadmap from "./pages/student/CareerRoadmap";
import SSimulator from "./pages/student/WhatIfSimulator";
import SOpportunities from "./pages/student/Opportunities";
import SOpportunityDetail from "./pages/student/OpportunityDetail";
import SApplications from "./pages/student/ApplicationsTracker";
import SPassport from "./pages/student/SkillPassport";
import SMockInterview from "./pages/student/MockInterview";
import SResume from "./pages/student/ResumeAnalyzer";
import SMentorship from "./pages/student/Mentorship";
import SChallenges from "./pages/student/Challenges";
import SCommunity from "./pages/student/Community";

// Industry
import IDashboard from "./pages/industry/Dashboard";
import IOrganization from "./pages/industry/OrganizationProfile";
import IPost from "./pages/industry/PostOpportunity";
import IPostings from "./pages/industry/ManagePostings";
import ICandidates from "./pages/industry/CandidateSearch";
import ICandidateDetail from "./pages/industry/CandidateDetail";
import IPipeline from "./pages/industry/RecruitmentPipeline";
import IChallenges from "./pages/industry/ChallengeEvaluation";
import IVerification from "./pages/industry/SkillVerification";
import IAnalytics from "./pages/industry/Analytics";

// Academician
import ADashboard from "./pages/academician/Dashboard";
import AProfile from "./pages/academician/Profile";
import ADiscovery from "./pages/academician/OpportunityDiscovery";
import ACollaboration from "./pages/academician/CollaborationHub";
import APortfolio from "./pages/academician/Portfolio";

// Institution
import NDashboard from "./pages/institution/Dashboard";
import NStudents from "./pages/institution/StudentOverview";
import NHeatmap from "./pages/institution/DepartmentHeatmap";
import NPlacements from "./pages/institution/PlacementAnalytics";
import NPartners from "./pages/institution/IndustryPartners";
import NReports from "./pages/institution/Reports";

const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "forgot-password", Component: ForgotPassword },
    ],
  },
  {
    path: "/student",
    element: <DashboardLayout role="student" />,
    children: [
      { index: true, Component: SDashboard },
      { path: "assessment", Component: SAssessment },
      { path: "skill-profile", Component: SSkillProfile },
      { path: "skill-gap", Component: SSkillGap },
      { path: "roadmap", Component: SRoadmap },
      { path: "simulator", Component: SSimulator },
      { path: "opportunities", Component: SOpportunities },
      { path: "opportunities/:id", Component: SOpportunityDetail },
      { path: "applications", Component: SApplications },
      { path: "passport", Component: SPassport },
      { path: "mock-interview", Component: SMockInterview },
      { path: "resume", Component: SResume },
      { path: "mentorship", Component: SMentorship },
      { path: "challenges", Component: SChallenges },
      { path: "community", Component: SCommunity },
      { path: "notifications", Component: Notifications },
    ],
  },
  {
    path: "/industry",
    element: <DashboardLayout role="industry" />,
    children: [
      { index: true, Component: IDashboard },
      { path: "organization", Component: IOrganization },
      { path: "post", Component: IPost },
      { path: "postings", Component: IPostings },
      { path: "candidates", Component: ICandidates },
      { path: "candidates/:id", Component: ICandidateDetail },
      { path: "pipeline", Component: IPipeline },
      { path: "challenges", Component: IChallenges },
      { path: "verification", Component: IVerification },
      { path: "analytics", Component: IAnalytics },
      { path: "notifications", Component: Notifications },
    ],
  },
  {
    path: "/academician",
    element: <DashboardLayout role="academician" />,
    children: [
      { index: true, Component: ADashboard },
      { path: "profile", Component: AProfile },
      { path: "discovery", Component: ADiscovery },
      { path: "collaboration", Component: ACollaboration },
      { path: "portfolio", Component: APortfolio },
      { path: "notifications", Component: Notifications },
    ],
  },
  {
    path: "/institution",
    element: <DashboardLayout role="institution" />,
    children: [
      { index: true, Component: NDashboard },
      { path: "students", Component: NStudents },
      { path: "heatmap", Component: NHeatmap },
      { path: "placements", Component: NPlacements },
      { path: "partners", Component: NPartners },
      { path: "reports", Component: NReports },
      { path: "notifications", Component: Notifications },
    ],
  },
  { path: "/unauthorized", Component: Unauthorized },
  { path: "*", Component: NotFound },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
