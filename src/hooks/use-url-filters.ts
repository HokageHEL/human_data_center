import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface FilterState {
  birthDate: string;
  militaryRank: string[];
  positionRank: string[];
  unit: string;
  gender: string;
  fitnessStatus: string;
  isInPPD: boolean;
  combatExperienceStatus: string;
}

interface SortConfig {
  field: string;
  order: 'asc' | 'desc' | null;
}

interface UseUrlFiltersReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: FilterState;
  setFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig | ((prev: SortConfig) => SortConfig)) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  birthDate: '',
  militaryRank: [],
  positionRank: [],
  unit: '',
  gender: '',
  fitnessStatus: '',
  isInPPD: false,
  combatExperienceStatus: 'all',
};

const defaultSortConfig: SortConfig = {
  field: 'shpoNumber',
  order: 'asc',
};

export const useUrlFilters = (): UseUrlFiltersReturn => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Parse filters from URL
  const parseFiltersFromUrl = useCallback((): FilterState => {
    return {
      birthDate: searchParams.get('birthDate') || '',
      militaryRank: searchParams.get('militaryRank') ? searchParams.get('militaryRank')!.split(',') : [],
      positionRank: searchParams.get('positionRank') ? searchParams.get('positionRank')!.split(',') : [],
      unit: searchParams.get('unit') || '',
      gender: searchParams.get('gender') || '',
      fitnessStatus: searchParams.get('fitnessStatus') || '',
      isInPPD: searchParams.get('isInPPD') === 'true',
      combatExperienceStatus: searchParams.get('combatExperienceStatus') || 'all',
    };
  }, [searchParams]);

  // Parse sort config from URL
  const parseSortConfigFromUrl = useCallback((): SortConfig => {
    const sortOrder = searchParams.get('sortOrder');
    return {
      field: searchParams.get('sortField') || 'shpoNumber',
      order: sortOrder === 'null' ? null : (sortOrder as 'asc' | 'desc') || 'asc',
    };
  }, [searchParams]);

  // Initialize state from URL
  const [searchTerm, setSearchTermState] = useState(searchParams.get('search') || '');
  const [filters, setFiltersState] = useState<FilterState>(parseFiltersFromUrl);
  const [sortConfig, setSortConfigState] = useState<SortConfig>(parseSortConfigFromUrl);

  // Update URL when state changes
  const updateUrl = useCallback((newSearchTerm: string, newFilters: FilterState, newSortConfig: SortConfig) => {
    const params = new URLSearchParams();
    
    // Add search term
    if (newSearchTerm) {
      params.set('search', newSearchTerm);
    }
    
    // Add filters
    if (newFilters.birthDate) params.set('birthDate', newFilters.birthDate);
    if (newFilters.militaryRank.length > 0) params.set('militaryRank', newFilters.militaryRank.join(','));
    if (newFilters.positionRank.length > 0) params.set('positionRank', newFilters.positionRank.join(','));
    if (newFilters.unit) params.set('unit', newFilters.unit);
    if (newFilters.gender) params.set('gender', newFilters.gender);
    if (newFilters.fitnessStatus) params.set('fitnessStatus', newFilters.fitnessStatus);
    if (newFilters.isInPPD) params.set('isInPPD', 'true');
    if (newFilters.combatExperienceStatus !== 'all') params.set('combatExperienceStatus', newFilters.combatExperienceStatus);
    
    // Add sort config
    if (newSortConfig.field !== 'shpoNumber') params.set('sortField', newSortConfig.field);
    if (newSortConfig.order !== 'asc') {
      params.set('sortOrder', newSortConfig.order === null ? 'null' : newSortConfig.order);
    }
    
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Wrapper functions that update both state and URL
  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term);
    updateUrl(term, filters, sortConfig);
  }, [filters, sortConfig, updateUrl]);

  const setFilters = useCallback((newFilters: FilterState | ((prev: FilterState) => FilterState)) => {
    const resolvedFilters = typeof newFilters === 'function' ? newFilters(filters) : newFilters;
    setFiltersState(resolvedFilters);
    updateUrl(searchTerm, resolvedFilters, sortConfig);
  }, [searchTerm, filters, sortConfig, updateUrl]);

  const setSortConfig = useCallback((newSortConfig: SortConfig | ((prev: SortConfig) => SortConfig)) => {
    const resolvedSortConfig = typeof newSortConfig === 'function' ? newSortConfig(sortConfig) : newSortConfig;
    setSortConfigState(resolvedSortConfig);
    updateUrl(searchTerm, filters, resolvedSortConfig);
  }, [searchTerm, filters, sortConfig, updateUrl]);

  const resetFilters = useCallback(() => {
    setSearchTermState('');
    setFiltersState(defaultFilters);
    setSortConfigState(defaultSortConfig);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // Update state when URL changes (e.g., browser back/forward)
  useEffect(() => {
    setSearchTermState(searchParams.get('search') || '');
    setFiltersState(parseFiltersFromUrl());
    setSortConfigState(parseSortConfigFromUrl());
  }, [searchParams, parseFiltersFromUrl, parseSortConfigFromUrl]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortConfig,
    setSortConfig,
    resetFilters,
  };
};