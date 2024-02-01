import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';
import React from 'react';
import { useAppContext } from '../../hooks/AppProvider';
import { play } from '../../lib/apiClient';

export function PositionControl() {
  const { state } = useAppContext();
  const sliderPosition = state.playbackInfo.position
    ? (state.playbackInfo.position / (state.playbackInfo.duration ?? 0)) * 100
    : 0;

  const [lock, setLock] = React.useState(false);
  const [lockValue, setLockValue] = React.useState(sliderPosition);
  const [contentId, setContentId] = React.useState(
    state.playbackInfo.contentId
  );

  React.useEffect(() => {
    if (!lock) {
      setLockValue(sliderPosition);
    }
  }, [sliderPosition]);

  React.useEffect(() => {
    if (!lock) {
      setContentId(state.playbackInfo.contentId);
    }
  }, [state.playbackInfo.contentId, lock]);

  return (
    <Slider
      value={lockValue}
      focusThumbOnChange={false}
      onChangeStart={() => {
        setLock(true);
        setContentId(state.playbackInfo.contentId);
      }}
      onChange={(val) => {
        setLockValue(val);
      }}
      onChangeEnd={(val) => {
        setLock(false);
        contentId &&
          contentId === state.playbackInfo.contentId &&
          play({
            contentId,
            position: (val / 100) * (state.playbackInfo.duration ?? 0),
          });
      }}
      colorScheme="green"
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  );
}
