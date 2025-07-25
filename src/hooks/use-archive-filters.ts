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

interface UseArchiveFiltersReturn {
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

export const useArchiveFilters = (): UseArchiveFiltersReturn => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Parse filters from URL with archive prefix
  const parseFiltersFromUrl = useCallback((): FilterState => {
    return {
      birthDate: searchParams.get('archive_birthDate') || '',
      militaryRank: searchParams.get('archive_militaryRank') ? searchParams.get('archive_militaryRank')!.split(',') : [],
      positionRank: searchParams.get('archive_positionRank') ? searchParams.get('archive_positionRank')!.split(',') : [],
      unit: searchParams.get('archive_unit') || '',
      gender: searchParams.get('archive_gender') || '',
      fitnessStatus: searchParams.get('archive_fitnessStatus') || '',
      isInPPD: searchParams.get('archive_isInPPD') === 'true',
      combatExperienceStatus: searchParams.get('archive_combatExperienceStatus') || 'all',
    };
  }, [searchParams]);

  // Parse sort config from URL with archive prefix
  const parseSortConfigFromUrl = useCallback((): SortConfig => {
    const sortOrder = searchParams.get('archive_sortOrder');
    return {
      field: searchParams.get('archive_sortField') || 'shpoNumber',
      order: sortOrder === 'null' ? null : (sortOrder as 'asc' | 'desc') || 'asc',
    };
  }, [searchParams]);

  // Initialize state from URL
  const [searchTerm, setSearchTermState] = useState(searchParams.get('archive_search') || '');
  const [filters, setFiltersState] = useState<FilterState>(parseFiltersFromUrl);
  const [sortConfig, setSortConfigState] = useState<SortConfig>(parseSortConfigFromUrl);

  // Update URL when state changes
  const updateUrl = useCallback((newSearchTerm: string, newFilters: FilterState, newSortConfig: SortConfig) => {
    const params = new URLSearchParams(searchParams);
    
    // Remove old archive parameters
    const archiveParams = Array.from(params.keys()).filter(key => key.startsWith('archive_'));
    archiveParams.forEach(param => params.delete(param));
    
    // Add search term
    if (newSearchTerm) {
      params.set('archive_search', newSearchTerm);
    }
    
    // Add filters
    if (newFilters.birthDate) params.set('archive_birthDate', newFilters.birthDate);
    if (newFilters.militaryRank.length > 0) params.set('archive_militaryRank', newFilters.militaryRank.join(','));
    if (newFilters.positionRank.length > 0) params.set('archive_positionRank', newFilters.positionRank.join(','));
    if (newFilters.unit) params.set('archive_unit', newFilters.unit);
    if (newFilters.gender) params.set('archive_gender', newFilters.gender);
    if (newFilters.fitnessStatus) params.set('archive_fitnessStatus', newFilters.fitnessStatus);
    if (newFilters.isInPPD) params.set('archive_isInPPD', 'true');
    if (newFilters.combatExperienceStatus !== 'all') params.set('archive_combatExperienceStatus', newFilters.combatExperienceStatus);
    
    // Add sort config
    if (newSortConfig.field !== 'shpoNumber') params.set('archive_sortField', newSortConfig.field);
    if (newSortConfig.order !== 'asc') {
      params.set('archive_sortOrder', newSortConfig.order === null ? 'null' : newSortConfig.order);
    }
    
    setSearchParams(params, { replace: true });
  }, [setSearchParams, searchParams]);

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
    
    // Remove only archive-specific parameters
    const params = new URLSearchParams(searchParams);
    const archiveParams = Array.from(params.keys()).filter(key => key.startsWith('archive_'));
    archiveParams.forEach(param => params.delete(param));
    setSearchParams(params, { replace: true });
  }, [setSearchParams, searchParams]);

  // Update state when URL changes (e.g., browser back/forward)
  useEffect(() => {
    setSearchTermState(searchParams.get('archive_search') || '');
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