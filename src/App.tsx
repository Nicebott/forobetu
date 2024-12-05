import React, { useState, useEffect, useCallback, useMemo } from 'react';
import SearchBar from './components/SearchBar';
import CourseTable from './components/CourseTable';
import Pagination from './components/Pagination';
import Chat from './components/Chat';
import LoadingSpinner from './components/LoadingSpinner';
import AuthModal from './components/AuthModal';
import Navigation from './components/Navigation';
import FAQ from './components/FAQ';
import Forum from './components/Forum/Forum';
import { Course, Section } from './types';
import { fetchCourseData } from './api/courseData';
import { removeDiacritics } from './utils/stringUtils';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Toaster } from 'react-hot-toast';

const ALL_CAMPUSES = [
  'Santo Domingo',
  'Santiago',
  'San Fco de Macorís',
  'Puerto Plata',
  'San Juan',
  'Barahona',
  'Mao',
  'Hato Mayor',
  'Higüey',
  'Bonao',
  'La Vega',
  'Baní',
  'Azua de Compostela',
  'Neyba',
  'Cotuí',
  'Nagua',
  'Dajabón'
];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [allSections, setAllSections] = useState<Section[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedCampus, setSelectedCampus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModality, setSelectedModality] = useState<string>('');
  const [showFAQ, setShowFAQ] = useState(false);
  const [showForum, setShowForum] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { courses, sections } = await fetchCourseData();
        setAllCourses(courses);
        setAllSections(sections);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearch = useCallback((query: string, campus: string) => {
    setSearchQuery(query);
    setSelectedCampus(campus);
    setCurrentPage(1);
    setShowFAQ(false);
    setShowForum(false);
  }, []);

  const filteredSections = useMemo(() => {
    const normalizedQuery = removeDiacritics(searchQuery.toLowerCase());
    
    return allSections.filter(section => {
      const course = allCourses.find(c => c.id === section.courseId);
      
      const matchesSearch = !normalizedQuery || 
        removeDiacritics(section.professor.toLowerCase()).includes(normalizedQuery) ||
        removeDiacritics(section.nrc.toLowerCase()).includes(normalizedQuery) ||
        (course && (
          removeDiacritics(course.name.toLowerCase()).includes(normalizedQuery) ||
          removeDiacritics(course. code.toLowerCase()).includes(normalizedQuery)
        ));

      const matchesCampus = !selectedCampus || section.campus === selectedCampus;
      
      const modalidad = section.modalidad.toLowerCase();
      const matchesModality = !selectedModality || 
        (selectedModality === 'virtual' && modalidad.includes('online')) ||
        (selectedModality === 'semipresencial' && (
          modalidad.includes('semi') || 
          modalidad.includes('semipresencial') || 
          modalidad.includes('semi presencial')
        ));

      return matchesSearch && matchesCampus && matchesModality;
    });
  }, [allSections, allCourses, searchQuery, selectedCampus, selectedModality]);

  const totalPages = Math.max(1, Math.ceil(filteredSections.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

  const currentSections = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSections.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSections, currentPage, itemsPerPage]);

  const currentCourses = useMemo(() => {
    const uniqueCourseIds = new Set(currentSections.map(section => section.courseId));
    return allCourses.filter(course => uniqueCourseIds.has(course.id));
  }, [currentSections, allCourses]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleModalityChange = (modality: string) => {
    setSelectedModality(modality === selectedModality ? '' : modality);
    setCurrentPage(1);
    setIsMenuOpen(false);
    setShowFAQ(false);
    setShowForum(false);
  };

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
    setSearchQuery('');
    setSelectedCampus('');
    setSelectedModality('');
    setCurrentPage(1);
    setShowFAQ(false);
    setShowForum(false);
  }, []);

  const handleFAQClick = () => {
    setShowFAQ(true);
    setShowForum(false);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleForumClick = () => {
    setShowForum(true);
    setShowFAQ(false);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <Toaster position="top-center" />
      
      <Navigation
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        user={user}
        showProfileDropdown={showProfileDropdown}
        setShowProfileDropdown={setShowProfileDropdown}
        setIsAuthModalOpen={setIsAuthModalOpen}
        selectedModality={selectedModality}
        handleModalityChange={handleModalityChange}
        scrollToTop={scrollToTop}
        handleFAQClick={handleFAQClick}
        showFAQ={showFAQ}
        showForum={showForum}
        handleForumClick={handleForumClick}
      />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center">
          {!showFAQ && !showForum && (
            <SearchBar 
              onSearch={handleSearch} 
              campuses={ALL_CAMPUSES} 
              selectedCampus={selectedCampus}
              darkMode={darkMode}
            />
          )}
          
          {showFAQ ? (
            <FAQ darkMode={darkMode} />
          ) : showForum ? (
            <Forum darkMode={darkMode} setIsAuthModalOpen={setIsAuthModalOpen} />
          ) : isLoading ? (
            <LoadingSpinner darkMode={darkMode} />
          ) : currentSections.length > 0 ? (
            <>
              <CourseTable
                courses={currentCourses}
                sections={currentSections}
                onRateSection={() => {
                  if (!user) {
                    setIsAuthModalOpen(true);
                  }
                }}
                darkMode={darkMode}
              />
              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={filteredSections.length}
                paginate={handlePageChange}
                currentPage={currentPage}
                darkMode={darkMode}
              />
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-4`}>
                Mostrando {currentSections.length} de {filteredSections.length} resultados
                {selectedCampus && ` en ${selectedCampus}`}
                {selectedModality && ` (${selectedModality})`}
              </p>
            </>
          ) : (
            <p className={`mt-8 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {selectedCampus
                ? `No se encontraron asignaturas para el campus de ${selectedCampus}.`
                : "No se encontraron asignaturas que coincidan con la búsqueda."}
            </p>
          )}
        </div>
      </main>
      
      <footer className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md mt-8`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500">
          © 2024 Nicebott. Todos los derechos reservados.
        </div>
      </footer>

      <Chat darkMode={darkMode} />
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        darkMode={darkMode}
      />
    </div>
  );
}

export default App;