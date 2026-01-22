import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Divider, Zoom } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BLOG_POSTS } from '../data/blogData';

const BlogView = () => {
    const { id } = useParams();
    const [subscribed, setSubscribed] = useState(false);
    const post = BLOG_POSTS.find(p => p.id === id);

    if (!post) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#020617', color: 'white' }}>
                <Typography variant="h4">Article Not Found</Typography>
                <Link to="/" style={{ textDecoration: 'none', marginLeft: '20px' }}>
                    <Button variant="contained">Return Home</Button>
                </Link>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#020617', pt: 15, pb: 20 }}>
            {/* Back Navigation */}
            <Container maxWidth="md">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            color: '#94a3b8',
                            mb: 6,
                            fontWeight: 700,
                            '&:hover': { color: '#ffffff', bgcolor: 'rgba(255,255,255,0.05)' }
                        }}
                    >
                        Back to Journal
                    </Button>
                </Link>

                {/* Article Header */}
                <Box sx={{ mb: 8 }}>
                    <Box sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 0.5,
                        bgcolor: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: '8px',
                        mb: 3,
                        border: '1px solid rgba(129, 140, 248, 0.2)'
                    }}>
                        <Typography sx={{ color: '#818cf8', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {post.category} • {post.readingTime}
                        </Typography>
                    </Box>

                    <Typography variant="h2" sx={{
                        fontWeight: 950,
                        color: '#ffffff',
                        mb: 4,
                        letterSpacing: '-0.04em',
                        lineHeight: 1.1,
                        background: 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        {post.title}
                    </Typography>

                    <Typography sx={{ color: '#94a3b8', fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.6 }}>
                        {post.desc}
                    </Typography>

                    <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white' }}>P</Box>
                        <Box>
                            <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem' }}>Precision Editorial</Typography>
                            <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>{post.date}</Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 8 }} />

                {/* Article Content */}
                <Box sx={{
                    color: '#cbd5e1',
                    fontSize: '1.15rem',
                    lineHeight: 1.8,
                    '& h3': { color: '#ffffff', mt: 6, mb: 3, fontWeight: 800, fontSize: '1.75rem' },
                    '& p': { mb: 4 },
                    '& blockquote': {
                        borderLeft: '4px solid #6366f1',
                        pl: 4,
                        my: 6,
                        fontStyle: 'italic',
                        color: '#ffffff',
                        fontSize: '1.4rem',
                        fontWeight: 500,
                        bgcolor: 'rgba(99, 102, 241, 0.05)',
                        py: 4,
                        pr: 4,
                        borderRadius: '0 20px 20px 0'
                    },
                    '& ul': { pl: 4, mb: 4 },
                    '& li': { mb: 2 },
                    '& strong': { color: '#ffffff', fontWeight: 700 }
                }}
                    dangerouslySetInnerHTML={{ __html: post.content }} />

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: 10 }} />

                {/* Newsletter / Footer Action */}
                <Box sx={{
                    p: 6,
                    borderRadius: '40px',
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 41, 59, 0.5) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center'
                }}>
                    {!subscribed ? (
                        <>
                            <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 950, mb: 2, fontFamily: 'Poppins' }}>Stay Sharp.</Typography>
                            <Typography sx={{ color: '#94a3b8', mb: 4, fontFamily: 'Poppins' }}>Get the latest financial intelligence delivered to your inbox.</Typography>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    onClick={() => setSubscribed(true)}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: '14px',
                                        bgcolor: '#6366f1',
                                        fontWeight: 800,
                                        fontFamily: 'Poppins',
                                        '&:hover': { bgcolor: '#4f46e5' }
                                    }}
                                >
                                    Subscribe to Journal
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Zoom in={subscribed}>
                            <Box>
                                <CheckCircleIcon sx={{ color: '#10b981', fontSize: '3rem', mb: 2 }} />
                                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 950, mb: 1, fontFamily: 'Poppins' }}>You're In.</Typography>
                                <Typography sx={{ color: '#94a3b8', fontFamily: 'Poppins' }}>Welcome to the inner circle of financial intelligence.</Typography>
                            </Box>
                        </Zoom>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default BlogView;
