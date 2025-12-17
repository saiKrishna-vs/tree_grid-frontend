import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Chip, TableSortLabel, TablePagination, Stack, useTheme, alpha } from '@mui/material';
import { Phone, Badge as BadgeIcon, FilterListOff } from '@mui/icons-material';

const ClientGrid = ({ clients, selectedAgeRange, selectedGender }) => {
    // Sorting State
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('firstName');
    const theme = useTheme();

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Sorting Logic
    const sortedClients = useMemo(() => {
        return [...clients].sort((a, b) => {
            let valueA = a[orderBy];
            let valueB = b[orderBy];

            // Handle combined name sorting if needed
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
            <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(theme.palette.text.secondary, 0.1)}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                {/* Could add export button here */}
            </Box>

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
                                                color: 'primary.main', // Better contrast
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
        </Paper>
    );
};

export default ClientGrid;
