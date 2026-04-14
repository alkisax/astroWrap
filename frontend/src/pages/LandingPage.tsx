import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import { colors } from "../constants/constants"; // custom χρώμα
// import ChartForm from '../components/controls/ChartForm';

const poemText = `
Once upon a time there was a lark who was renowned for her beautiful singing. Her song was judged by all who heard her to be the sweetest sound on earth. From dawn to dusk she would sing her song and as she sang, the beginnings of a desire grew. The desire was to sing for the gods. 

She realized that if she could fly high enough the gods would be able to hear her. So the lark leapt into the air and flew as high as she could, but her wings tired and although she sang, she knew that the gods could not hear her. Determined now more than ever, she decided that she would climb the highest mountain and then fly from the peak. But even this could not get her high enough to be heard in heaven.

One day she saw an eagle soaring high in the sky, far higher then she had ever flown and she knew with unbounded certainty that if she could fly as high as the eagle, the gods would hear her beautiful song. So she watched the eagle and when he landed, she approached the huge bird. The small but brave lark explained her dilemma to the great eagle and asked if he would carry her on his back so that, together, they could entertain the gods.

Now the eagle was aware of the gods because he could fly in their domain and yet, ashamed of his raucous voice, he never had the courage to contact them. Eagerly he agreed to carry the tiny lark.

Tentatively she climbed onto his back and with a stretch and a flap of his mighty wings, he set aloft. Higher and higher they soared. The lark was almost too scared to look down and yet onward still they flew. The lark had never been this high. She could see the whole world spread out beneath her. And then, all of a sudden, they were there. The tiny lark knew that now it was her turn, the eagle having done his part. Firmly she stood up on the eagle’s back and, filling her lungs with air, began to sing. Heaven was filled with her glorious music. The gods were astonished at the power of the eagle and enthralled by the beauty of the lark’s song. The eagle was no longer ashamed and the lark was filled with joy. Together, as a team, they had brought music to the gods.
`;

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* <Container maxWidth='md'>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
          }}
        >
          🔝 actions
          <Paper
            sx={{
              width: 235,
              p: 2,
              borderRadius: '12px',
              background: 'rgba(20,20,30,0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
            }}
          >
            <Stack spacing={1.5} alignItems='stretch'>
              <Typography
                variant='h6'
                sx={{
                  textAlign: 'center',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                Start
              </Typography>

              <Button
                variant='contained'
                fullWidth
                onClick={() => navigate('/login')}
                sx={{
                  textTransform: 'none',
                  backgroundColor: colors.primary,
                }}
              >
                Login
              </Button>

              <Button
                variant='outlined'
                fullWidth
                onClick={() =>
                  navigate('/single', {
                    state: {
                      date: new Date(),
                      lat: 37.9838,
                      lng: 23.7275,
                    },
                  })
                }
                sx={{
                  textTransform: 'none',
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.2)',
                }}
              >
                Continue as guest
              </Button>
            </Stack>
          </Paper>

          🔽 form
          <ChartForm
            onSubmit={({ date, lat, lng }) => {
              navigate('/single', {
                state: { date, lat, lng },
              })
            }}
          />
        </Box>
      </Container> */}

      <Container maxWidth='md'>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            py: 6,
            px: 2,
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mb: 4 }}
          >
            <Button
              variant='contained'
              size='large'
              onClick={() => navigate('/single')}
              sx={{
                minWidth: '180px',
                borderRadius: '999px',
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              Single Chart
            </Button>

            <Button
              variant='outlined'
              size='large'
              onClick={() => navigate('/biwheel')}
              sx={{
                minWidth: '180px',
                borderRadius: '999px',
                textTransform: 'none',
                fontSize: '1rem',
                color: 'white',
                borderColor: 'white',
              }}
            >
              Relationship Analysis
            </Button>
          </Stack>

          <Box
            sx={{
              width: '100%',
              maxWidth: '800px',
              backgroundColor: 'rgba(0, 0, 0, 0.55)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 3,
              p: { xs: 3, sm: 5 },
              backdropFilter: 'blur(3px)',
            }}
          >
            <Typography
              variant='h3'
              sx={{
                mb: 4,
                color: 'white',
                textAlign: 'center',
                fontFamily: '"Caveat", "Segoe Print", "Comic Sans MS", cursive',
                fontWeight: 700,
                fontSize: { xs: '2.2rem', sm: '3rem' },
                letterSpacing: '0.04em',
              }}
            >
              THE FABLE OF THE EAGLE AND THE LARK
            </Typography>

            <Typography
              sx={{
                color: 'rgba(255,255,255,0.92)',
                whiteSpace: 'pre-line',
                lineHeight: 1.9,
                fontFamily: '"Caveat", "Segoe Print", "Comic Sans MS", cursive',
                fontSize: { xs: '0.8rem', sm: '1rem' },
                textAlign: 'left',
              }}
            >
              {poemText}
            </Typography>
          </Box>
        </Box>
      </Container>
    </>

  );
};

export default LandingPage;