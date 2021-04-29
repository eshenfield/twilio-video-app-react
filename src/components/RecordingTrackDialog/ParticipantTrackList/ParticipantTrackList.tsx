import React, { PropsWithChildren } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Participant } from 'twilio-video';

interface ParticipantTrackList {
  participant: Participant;
  selectedTrackSids: string[];
  handleChange(trackSid: string, checked: boolean): void;
}

function ParticipantTrackList({
  participant,
  selectedTrackSids,
  handleChange,
}: PropsWithChildren<ParticipantTrackList>) {
  return (
    <>
      <p>{participant.identity}</p>
      {[...participant.audioTracks.values()].map(track => {
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedTrackSids.includes(track.trackSid)}
                onChange={(_, checked) => handleChange(track.trackSid, checked)}
                key={track.trackSid}
              />
            }
            key={'Audio'}
            label={'Audio'}
          />
        );
      })}
      {[...participant.videoTracks.values()].map(track => {
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedTrackSids.includes(track.trackSid)}
                onChange={(_, checked) => handleChange(track.trackSid, checked)}
                key={track.trackSid}
              />
            }
            key={'Video'}
            label={'Video'}
          />
        );
      })}
      {/* TODO: Screenshare */}
    </>
  );
}

export default ParticipantTrackList;
