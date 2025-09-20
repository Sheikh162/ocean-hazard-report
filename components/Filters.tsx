// app/admin/reports/Filters.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FiltersProps {
  initialFilters: {
    incidentCategory?: string;
    casualtyStatus?: string;
    fromReportDate?: string;
    toReportDate?: string;
    flag?: string;
    deaths?: string;
    fromIncidentDate?: string;
    toIncidentDate?: string;
    shipType?: string;
    injuries?: string;
    area?: string;
  };
}

export default function Filters({ initialFilters }: FiltersProps) {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with new filters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/admin/reports?${params.toString()}`);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <h2 className="text-lg font-semibold mb-4 text-black">Filters</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Filter inputs (same as before) */}
        {/* ... */}
        
        <div className="flex items-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
          <button
            type="button"
            className="ml-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-black"
            onClick={() => {
              setFilters({
                incidentCategory: '',
                casualtyStatus: '',
                fromReportDate: '',
                toReportDate: '',
                flag: '',
                deaths: '',
                fromIncidentDate: '',
                toIncidentDate: '',
                shipType: '',
                injuries: '',
                area: ''
              });
              router.push('/admin/reports');
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}