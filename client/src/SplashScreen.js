import { Box, LinearProgress } from '@mui/material'
import React from 'react'

function SplashScreen() {
    return (
        <div className='flex justify-center items-center h-screen' >
            Loading...
            <Box sx={{ width: '80%' }}>
                <LinearProgress />
            </Box>

        </div>
    )
}

export default SplashScreen
