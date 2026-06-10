import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Chat from "../pages/Chat/Chat";
import Compare from "../pages/Compare/Compare";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Summarizer from "../pages/Summarizer/Summarizer";
import Trends from "../pages/Trends/Trends";
import Workspace from "../pages/Workspace/Workspace";

import AdvancedAnalytics from "../pages/Analytics/AdvancedAnalytics";
import About from "../pages/About/About";
import Features from "../pages/Features/Features";
import Contact from "../pages/Contact/Contact";

import Layout from "../components/layout/Layout";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ProtectedRoute from "../components/auth/ProtectedRoute";
import NotFound from "../pages/NotFound/NotFound";

const queryClient = new QueryClient();

import { CompareProvider } from "../context/CompareContext";
import CompareTray from "../components/CompareTray";

function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CompareProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/summarizer" element={<Summarizer />} />
              <Route path="/trends" element={<Trends />} />
              <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
              
              {/* Informational Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Protected Routes */}
              <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
              <Route path="/workspace" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />

              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CompareTray />
          </Layout>
        </CompareProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default AppRoutes;
