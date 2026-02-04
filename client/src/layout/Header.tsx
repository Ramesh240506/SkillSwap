import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Users, BookOpen, LayoutDashboard, Home } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-black shadow-lg fixed w-full top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <NavLink to="/landing" className="flex items-center space-x-2 group">
              <div className="bg-yellow-400 p-2 rounded-lg group-hover:bg-yellow-500 transition-colors">
                <Users className="h-6 w-6 text-black" />
              </div>
              <span className="text-xl lg:text-2xl font-bold text-yellow-400">
                SkillSwap
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center space-x-8 xl:space-x-16 absolute left-1/2 transform -translate-x-1/2">
            <NavLink
              to="/landing"
              className={({ isActive }) =>
                `text-base xl:text-lg font-medium transition-colors hover:text-yellow-400 whitespace-nowrap ${
                  isActive ? "text-yellow-400" : "text-white"
                }`
              }
            >
                <Home className="w-5 h-5 inline mr-2" />
              Home
            </NavLink>
            <NavLink
              to="/skills"
              className={({ isActive }) =>
                `text-base xl:text-lg font-medium transition-colors hover:text-yellow-400 whitespace-nowrap ${
                  isActive ? "text-yellow-400" : "text-white"
                }`
              }
            >
              <BookOpen className="w-5 h-5 inline mr-2" />
              Explore Skills
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-base xl:text-lg font-medium transition-colors hover:text-yellow-400 whitespace-nowrap ${
                  isActive ? "text-yellow-400" : "text-white"
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5 inline mr-2" />
              Dashboard
            </NavLink>
          </div>

          {/* Get Started Button */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            <NavLink
              to="/"
              className="bg-yellow-400 text-black px-4 xl:px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-sm xl:text-base"
            >
              Get Started
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-yellow-400 hover:text-yellow-500 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4">
              <NavLink
                to="/landing"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  `text-lg font-medium transition-colors hover:text-yellow-400 ${
                    isActive ? "text-yellow-400" : "text-white"
                  }`
                }
              >
                <Home className="w-5 h-5 inline mr-2" />
                Home
              </NavLink>
              <NavLink
                to="/skills"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  `text-lg font-medium transition-colors hover:text-yellow-400 ${
                    isActive ? "text-yellow-400" : "text-white"
                  }`
                }
              >
                <BookOpen className="w-5 h-5 inline mr-2" />
                Explore Skills
              </NavLink>
              <NavLink
                to="/dashboard"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  `text-lg font-medium transition-colors hover:text-yellow-400 ${
                    isActive ? "text-yellow-400" : "text-white"
                  }`
                }
              >
                <LayoutDashboard className="w-5 h-5 inline mr-2" />
                Dashboard
              </NavLink>
              <NavLink
                to="/auth"
                onClick={toggleMenu}
                className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-center"
              >
                Get Started
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
