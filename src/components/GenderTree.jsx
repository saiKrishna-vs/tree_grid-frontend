import React, { useState } from 'react';
import { List, ListItemButton, ListItemText, Collapse, Typography, Paper, Box, Avatar, useTheme, alpha } from '@mui/material';
import { ExpandLess, ExpandMore, Person, Group } from '@mui/icons-material';

const AGE_RANGES = [
    { label: '10-30', low: 10, high: 30 },
    { label: '30-60', low: 30, high: 60 },
    { label: '60-90', low: 60, high: 90 },
];

const GenderNode = ({ gender, count, selectedGender, selectedAgeRange, onSelectAgeGroup }) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <ListItemButton
                onClick={handleClick}
                sx={{
                    my: 1,
                    mx: 2,
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    // Use theme.palette.action.selected or alpha(primary) for better contrast in both modes
                    bgcolor: (selectedGender === gender)
                        ? alpha(theme.palette.primary.main, 0.12)
                        : 'transparent',
                    '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04)
                    }
                }}
            >
                <Avatar
                    variant="rounded"
                    sx={{
                        mr: 2,
                        width: 32,
                        height: 32,
                        // Dynamic background based on mode
                        bgcolor: open
                            ? 'primary.main'
                            : alpha(theme.palette.text.primary, 0.05),
                        color: open
                            ? 'primary.contrastText'
                            : 'text.secondary',
                        transition: 'all 0.3s'
                    }}
                >
                    <Group fontSize="small" />
                </Avatar>
                <ListItemText
                    primary={gender}
                    secondary={`${count} Records`}
                    primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                    secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                />
                {open ? <ExpandLess sx={{ color: 'text.secondary' }} /> : <ExpandMore sx={{ color: 'text.secondary' }} />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {AGE_RANGES.map((range) => {
                        const isSelected = selectedGender === gender && selectedAgeRange?.low === range.low && selectedAgeRange?.high === range.high;

                        return (
                            <ListItemButton
                                key={range.label}
                                sx={{
                                    pl: 9,
                                    my: 0.5,
                                    mx: 2,
                                    borderRadius: 2,
                                    position: 'relative',
                                    bgcolor: isSelected ? 'primary.main' : 'transparent', // Active State
                                    color: isSelected ? 'primary.contrastText' : 'text.primary',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        left: 48,
                                        top: '50%',
                                        width: 12,
                                        height: 2,
                                        bgcolor: alpha(theme.palette.text.secondary, 0.2), // Connector line
                                        transform: 'translateY(-50%)'
                                    },
                                    '&:hover': {
                                        bgcolor: isSelected
                                            ? 'primary.dark'
                                            : alpha(theme.palette.primary.main, 0.08),
                                        color: isSelected ? 'primary.contrastText' : 'primary.main'
                                    }
                                }}
                                onClick={() => onSelectAgeGroup(gender, range.low, range.high)}
                            >
                                <ListItemText
                                    primary={`Age ${range.label}`}
                                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isSelected ? 600 : 500 }}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>
            </Collapse>
        </>
    );
};

const GenderTree = ({ genderList, selectedGender, selectedAgeRange, onSelectAgeGroup }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                height: '100%',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                borderRadius: 3
            }}
        >
            <Box sx={{ p: 3, pb: 1 }}>
                <Typography variant="h6" sx={{ color: 'text.primary', mb: 0.5 }}>
                    Filters
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Select a category to filter the grid
                </Typography>
            </Box>
            <List component="nav" disablePadding sx={{ overflow: 'auto', flexGrow: 1, px: 0 }}>
                {genderList.map((item) => (
                    <GenderNode
                        key={item.gender}
                        gender={item.gender}
                        count={item.count}
                        selectedGender={selectedGender}
                        selectedAgeRange={selectedAgeRange}
                        onSelectAgeGroup={onSelectAgeGroup}
                    />
                ))}
            </List>
        </Paper>
    );
};

export default GenderTree;
