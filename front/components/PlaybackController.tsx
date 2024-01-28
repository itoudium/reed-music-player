import { Box, Button, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Stack } from "@chakra-ui/react";
import React from "react";
import { useAppContext } from "../hooks/AppProvider";
import { play, stop } from "../lib/apiClient";
import { Icon } from '@chakra-ui/react'
import { BsPause } from 'react-icons/bs';
import { BsPlay } from 'react-icons/bs';
import { BsSkipForward } from 'react-icons/bs';
import { BsSkipBackward } from 'react-icons/bs';

export function PlaybackController() {

  const { state } = useAppContext();

  const sliderPosition = state.playbackInfo.position ?
    state.playbackInfo.position / (state.playbackInfo.duration ?? 0) * 100 : 0;

  const onClickPlay = () => {
    play({});
  }

  const onClickStop = () => {
    stop();
  }

  return (
    <Box maxW="sm">
      <Stack direction="row">
        <Button variant="ghost">
          <Icon as={BsSkipBackward} />
        </Button>
        {state.playbackInfo.status === 'playing' ?
          <Button onClick={onClickStop} variant="ghost">
            <Icon as={BsPause} />
          </Button> :
          <Button onClick={onClickPlay} variant="ghost">
            <Icon as={BsPlay} />
          </Button>}
        <Button variant="ghost">
          <Icon as={BsSkipForward} />
        </Button>
      </Stack>

      <Box p={3}>
        <Slider value={sliderPosition}
          focusThumbOnChange={false}

          onChangeEnd={val => console.log(val)}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        position: {state.playbackInfo.position}
      </Box>

    </Box >
  )
}