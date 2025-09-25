"use client";

import { useState, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Chip,
  Alert,
  Grid,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Search, Clear, Phone } from "@mui/icons-material";
import { useAdvocates } from "@/hooks/useAdvocates";

const initialFilterState = {
  search: "",
  city: "",
  degree: "",
  specialty: "",
  minExperience: "",
  maxExperience: "",
};

const initialPaginationSortingState = {
  page: 1,
  limit: 25,
  sortBy: "firstName" as const,
  sortOrder: "asc" as const,
};

export default function Home() {

  const [filters, setFilters] = useState(initialFilterState);

  const { data: advocates, loading, error, pagination, updateFilters, refetch, currentFilters } = useAdvocates(initialPaginationSortingState);

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);

    // Convert empty strings to undefined for API
    const apiFilters: any = {};
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val && val.trim() !== "") {
        if (key === "minExperience" || key === "maxExperience") {
          apiFilters[key] = parseInt(val);
        } else {
          apiFilters[key] = val;
        }
      }
    });

    updateFilters(apiFilters);
  };

  const handleClearFilters = () => {
    setFilters(initialFilterState);

    // Reset to initial state with proper defaults
    const resetParams = {
      ...initialPaginationSortingState,
      // Only keep limit from current filters if it's different from default
      limit: currentFilters.limit !== initialPaginationSortingState.limit
        ? currentFilters.limit
        : initialPaginationSortingState.limit,
    };

    updateFilters(resetParams);
  };

  const columns: GridColDef[] = [
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "degree",
      headerName: "Degree",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: "specialties",
      headerName: "Specialties",
      flex: 2,
      minWidth: 250,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.25 }}>
          {params.value.map((specialty: string, index: number) => (
            <Chip
              key={index}
              label={specialty}
              size="small"
              variant="outlined"
              sx={{
                marginBottom: 0.25,
                fontSize: '0.7rem',
                height: '20px',
                '& .MuiChip-label': {
                  paddingX: 0.5
                }
              }}
            />
          ))}
        </Box>
      ),
    },
    {
      field: "yearsOfExperience",
      headerName: "Experience",
      type: "number",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => `${params.value} years`,
    },
    {
      field: "phoneNumber",
      headerName: "Phone",
      flex: 0.9,
      minWidth: 140,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Phone fontSize="small" />
          {params.value?.toString().replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
        </Box>
      ),
    },
  ];

  const specialties = useMemo(() => {
    const allSpecialties = advocates.flatMap(advocate => advocate.specialties);
    return Array.from(new Set(allSpecialties)).sort();
  }, [advocates]);

  const cities = useMemo(() => {
    const allCities = advocates.map(advocate => advocate.city);
    return Array.from(new Set(allCities)).sort();
  }, [advocates]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Box sx={{ mb: 3 }}>
          <img
            src="https://cdn.prod.website-files.com/632a21d0ec93a082b11988a0/666868fe2677eab531bd589e_Solace.svg"
            alt="Solace Logo"
            style={{ height: "60px", marginBottom: "16px" }}
            width="auto"
            height="60"
          />
        </Box>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: "white" }}>
          Advocates Directory
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, color: "rgba(255,255,255,0.8)" }}>
          Search, filter, and connect with qualified mental health advocates in your area
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Search /> Search & Filter Advocates
          </Typography>
          <Grid container spacing={1.5} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
              <TextField
                fullWidth
                label="Search"
                placeholder="Name, city, degree..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                size="small"
                sx={{ minWidth: 180 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth size="small" sx={{ minWidth: 160 }}>
                <InputLabel>City</InputLabel>
                <Select
                  value={filters.city}
                  label="City"
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                >
                  <MenuItem value="">All Cities</MenuItem>
                  {cities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
              <FormControl fullWidth size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Degree</InputLabel>
                <Select
                  value={filters.degree}
                  label="Degree"
                  onChange={(e) => handleFilterChange("degree", e.target.value)}
                >
                  <MenuItem value="">All Degrees</MenuItem>
                  <MenuItem value="MD">MD</MenuItem>
                  <MenuItem value="PhD">PhD</MenuItem>
                  <MenuItem value="MSW">MSW</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
              <FormControl fullWidth size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Specialty</InputLabel>
                <Select
                  value={filters.specialty}
                  label="Specialty"
                  onChange={(e) => handleFilterChange("specialty", e.target.value)}
                >
                  <MenuItem value="">All Specialties</MenuItem>
                  {specialties.map((specialty) => (
                    <MenuItem key={specialty} value={specialty}>
                      {specialty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6, sm: 3, md: 1.25 }}>
              <TextField
                fullWidth
                label="Min Exp"
                type="number"
                value={filters.minExperience}
                onChange={(e) => handleFilterChange("minExperience", e.target.value)}
                size="small"
                sx={{ minWidth: 100 }}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3, md: 1.25 }}>
              <TextField
                fullWidth
                label="Max Exp"
                type="number"
                value={filters.maxExperience}
                onChange={(e) => handleFilterChange("maxExperience", e.target.value)}
                size="small"
                sx={{ minWidth: 100 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<Clear />}
                size="small"
                sx={{ minWidth: 100 }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {pagination && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Showing {advocates.length} of {pagination.total} advocates
            </Typography>
          )}

          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={advocates}
              columns={columns}
              loading={loading}
              pagination
              paginationMode="server"
              rowCount={pagination?.total || 0}
              paginationModel={{
                page: (pagination?.page || 1) - 1,
                pageSize: pagination?.limit || 25,
              }}
              onPaginationModelChange={(model) => {
                updateFilters({
                  page: model.page + 1,
                  limit: model.pageSize,
                });
              }}
              pageSizeOptions={[10, 25, 50, 100]}
              disableRowSelectionOnClick
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: false,
                },
              }}
              sx={{
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#ffffff !important',
                  color: '#333333 !important',
                  fontWeight: 600,
                  borderBottom: '2px solid #e0e0e0',
                },
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#ffffff !important',
                  color: '#333333 !important',
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 600,
                  color: '#333333 !important',
                },
                '& .MuiDataGrid-columnHeaderTitleContainer': {
                  color: '#333333 !important',
                },
                '& .MuiDataGrid-scrollbarFiller--header': {
                  backgroundColor: '#ffffff !important',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #e0e0e0',
                  color: '#333333',
                },
                '& .MuiDataGrid-row': {
                  backgroundColor: '#ffffff',
                  '&:nth-of-type(even)': {
                    backgroundColor: '#fafafa',
                  },
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
