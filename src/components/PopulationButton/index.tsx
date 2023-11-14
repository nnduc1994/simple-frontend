import  { useState, useEffect } from 'react'

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box';


type PopulationInfo = {
    year: string, 
    population: string
}

const getCityPopulation = async (city: string): Promise<PopulationInfo> => {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries/population/cities", {
        method: "POST", 
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({city})
    })
    const data = await response.json()
    const latestInfo = data.data.populationCounts[0];

    return { year: latestInfo.year, population: latestInfo.value }
}

const PopulationButton = (): JSX.Element => {
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [city, setCity] = useState<string>('');
    const [populationInfo, setPopulationInfo] = useState<PopulationInfo | undefined>(undefined);

    useEffect(() => {
        return (() => {
            setCity('')
            setPopulationInfo(undefined)
        })
    }, [])

    const handleClose = () => {
        setShowDialog(false)
    }

    const handleOnTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value)
    }

    const handleOnClick = async () => {
        const populationInfo = await getCityPopulation(city)
        setPopulationInfo(populationInfo)
    }

    return (<>
    <Dialog onClose={handleClose} open={showDialog}>
            <DialogTitle>
              Population Info
            </DialogTitle>
            <DialogContent>
                <Box pt={2} pb={3}>
                    <TextField label="Enter city" variant='outlined' value={city} onChange={handleOnTextChange} />
                </Box>
                <Box pb={3}>
                    <Button variant='contained' onClick={handleOnClick}>Check</Button>
                </Box>
                { populationInfo &&
                    <>
                        <Typography variant='h6'>{`Latest info is from year ${populationInfo.year}`}</Typography>
                        <Typography variant='h6'>{`Population ${populationInfo.population}`}</Typography>
                    </>
                }
            </DialogContent>
        </Dialog>
        <Button variant='contained' onClick={() => setShowDialog(true)}>Open to check population</Button>
    </>)
}

export default PopulationButton;