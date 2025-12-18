import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Chip, TableSortLabel, TablePagination, Stack, useTheme, alpha, Grid, Card, CardContent, IconButton, Select, MenuItem } from '@mui/material';
import { Phone, Badge as BadgeIcon, FilterListOff, GridView, ViewList, Person, Cake } from '@mui/icons-material';





const ClientGrid = ({ clients, selectedAgeRange, selectedGender }) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('firstName');
    const [viewMode, setViewMode] = useState('table');

    const theme = useTheme();

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleViewChange = (event) => {
        setViewMode(event.target.value);
    };
    const sortedClients = useMemo(() => {
        return [...clients].sort((a, b) => {
            let valueA = a[orderBy];
            let valueB = b[orderBy];


            if (orderBy === 'name') {
                valueA = (a.firstName + a.lastName).toLowerCase();
                valueB = (b.firstName + b.lastName).toLowerCase();
            } else if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            if (valueB < valueA) {
                return order === 'asc' ? 1 : -1;
            }
            if (valueB > valueA) {
                return order === 'asc' ? -1 : 1;
            }
            return 0;
        });
    }, [clients, order, orderBy]);

    if (!selectedAgeRange) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 5,
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    borderStyle: 'dashed',
                    borderColor: alpha(theme.palette.text.secondary, 0.2)
                }}
            >
                <FilterListOff sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" color="text.primary" gutterBottom>
                    No Filter Selected
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                    Please select a gender (Male/Female) and age group from the sidebar to view the client roster.
                </Typography>
            </Paper>
        );
    }

    const headCells = [
        { id: 'firstName', label: 'Name' },
        { id: 'phone', label: 'Phone' },
        { id: 'ssn', label: 'SSN' },
        { id: 'age', label: 'Age' },
    ];


    const renderCardView = () => (
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, pt: 0 }}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(2, 1fr)',
                        lg: 'repeat(3, 1fr)',
                        xl: 'repeat(4, 1fr)'
                    },
                    gap: 3
                }}
            >
                {sortedClients.length > 0 ? (
                    sortedClients.map((client, index) => (
                        <Card
                            key={index}
                            elevation={0}
                            sx={{
                                border: `1px solid ${alpha(theme.palette.text.secondary, 0.1)}`,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.background.default, 0.5),
                                transition: 'all 0.2s',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                                    borderColor: alpha(theme.palette.primary.main, 0.3)
                                }
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                            {client.firstName} {client.lastName}
                                        </Typography>
                                        <Chip
                                            label={client.gender || selectedGender}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                fontSize: '0.7rem',
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: 'primary.main',
                                                fontWeight: 600
                                            }}
                                        />
                                    </Box>
                                    <AvatarPlaceholder theme={theme} />
                                </Stack>

                                <Stack spacing={1.5}>
                                    <InfoRow icon={<Phone fontSize="inherit" />} label="Phone" value={client.phone} />
                                    <InfoRow icon={<BadgeIcon fontSize="inherit" />} label="SSN" value={client.ssn} />
                                    <InfoRow
                                        icon={<Cake fontSize="inherit" />}
                                        label="Age"
                                        value={client.age}
                                        highlight
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 8, color: 'text.secondary' }}>
                        <Typography>No clients found matching the criteria.</Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );


    const renderTableView = () => (
        <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Table stickyHeader aria-label="client table">
                <TableHead>
                    <TableRow>
                        {headCells.map((headCell) => (
                            <TableCell
                                key={headCell.id}
                                sortDirection={orderBy === headCell.id ? order : false}
                                sx={{
                                    bgcolor: 'background.paper',
                                    color: 'text.secondary',
                                    borderBottom: `1px solid ${alpha(theme.palette.text.secondary, 0.1)}`,
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={() => handleRequestSort(headCell.id)}
                                    sx={{
                                        '&.Mui-active': { color: 'text.primary' },
                                        '&:hover': { color: 'text.primary' }
                                    }}
                                >
                                    {headCell.label}
                                </TableSortLabel>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedClients.length > 0 ? (
                        sortedClients.map((client, index) => (
                            <TableRow
                                key={index}
                                hover
                                sx={{
                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) + ' !important' },
                                    '& td': { borderBottom: `1px solid ${alpha(theme.palette.text.secondary, 0.05)}`, color: 'text.primary', fontSize: '0.875rem' },
                                    cursor: 'default'
                                }}
                            >
                                <TableCell>
                                    <Typography variant="body2" fontWeight="500">{client.firstName} {client.lastName}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                        <Phone fontSize="inherit" sx={{ fontSize: 14, opacity: 0.7 }} />
                                        <span style={{ fontFamily: 'Inter, sans-serif' }}>{client.phone}</span>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                        <BadgeIcon fontSize="inherit" sx={{ fontSize: 14, opacity: 0.7 }} />
                                        <span style={{ fontFamily: 'Inter, sans-serif' }}>{client.ssn}</span>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={client.age}
                                        size="small"
                                        sx={{
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: 'primary.main',
                                            fontWeight: 600,
                                            borderRadius: 1,
                                            height: 24,
                                            minWidth: 32
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 8, borderBottom: 'none' }}>
                                <Typography color="text.secondary" variant="body2">
                                    No clients found matching the criteria.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Paper
            elevation={0}
            sx={{
                height: '100%',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                borderRadius: 3,
            }}
        >
            <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.text.secondary, 0.1)}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Typography variant="h6" color="text.primary">
                            Client List
                        </Typography>
                        <Chip
                            label={selectedGender}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ borderRadius: 1.5, fontWeight: 600, height: 24 }}
                        />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Showing {clients.length} records for age group {selectedAgeRange.low}-{selectedAgeRange.high}
                    </Typography>
                </Box>

                {/* View Toggle */}
                <Box sx={{ minWidth: 140 }}>
                    <Select
                        value={viewMode}
                        onChange={handleViewChange}
                        size="small"
                        displayEmpty
                        renderValue={(selected) => (
                            <Stack direction="row" alignItems="center" gap={1}>
                                {selected === 'table' ? <ViewList fontSize="small" /> : <GridView fontSize="small" />}
                                <Typography variant="body2" fontWeight={600}>
                                    {selected === 'table' ? 'Table View' : 'Card View'}
                                </Typography>
                            </Stack>
                        )}
                        sx={{
                            height: 36,
                            borderRadius: 2,
                            borderColor: alpha(theme.palette.text.secondary, 0.2),
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: alpha(theme.palette.text.secondary, 0.2),
                            },
                        }}
                    >
                        <MenuItem value="table">
                            <Stack direction="row" alignItems="center" gap={1}>
                                <ViewList fontSize="small" />
                                <Typography variant="body2">Table View</Typography>
                            </Stack>
                        </MenuItem>
                        <MenuItem value="card">
                            <Stack direction="row" alignItems="center" gap={1}>
                                <GridView fontSize="small" />
                                <Typography variant="body2">Card View</Typography>
                            </Stack>
                        </MenuItem>
                    </Select>
                </Box>
            </Box>

            {viewMode === 'table' ? renderTableView() : renderCardView()}
        </Paper>
    );
};

// Helper Components
const InfoRow = ({ icon, label, value, highlight }) => (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
            <Box sx={{ display: 'flex', opacity: 0.7, fontSize: 16 }}>{icon}</Box>
            <Typography variant="body2" fontSize="0.8rem">{label}:</Typography>
        </Stack>
        <Typography
            variant="body2"
            fontWeight={highlight ? 600 : 400}
            color={highlight ? 'text.primary' : 'text.secondary'}
            fontFamily="Inter, sans-serif"
        >
            {value}
        </Typography>
    </Stack>
);

const AvatarPlaceholder = ({ theme }) => (
    <Box sx={{
        width: 40,
        height: 40,
        borderRadius: 2,
        bgcolor: alpha(theme.palette.primary.main, 0.1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'primary.main'
    }}>
        <Person fontSize="small" />
    </Box>
);

export default ClientGrid;
