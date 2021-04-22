import React, { PropsWithChildren, useState } from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { RecordingRules } from '../../types';
import { useAppState } from '../../state';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useParticipants from '../../hooks/useParticipants/useParticipants';

interface RecordingTrackDialog {
  open: boolean;
  onClose(): void;
}

type SelectedTrackSids = string[];

function RecordingTrackDialog({ open, onClose }: PropsWithChildren<RecordingTrackDialog>) {
  const { updateRecordingRules } = useAppState();
  const { room } = useVideoContext();
  const participants = useParticipants();

  const [selectedTrackSids, setSelectedTrackSids] = useState<SelectedTrackSids>([]);

  const handleChange = (trackSid: string, checked: boolean) => {
    if (checked) {
      setSelectedTrackSids([...selectedTrackSids, trackSid]);
    } else {
      const newSelectedTrackSids = [...selectedTrackSids];
      const index = newSelectedTrackSids.indexOf(trackSid);
      newSelectedTrackSids.splice(index, 1);
      setSelectedTrackSids(newSelectedTrackSids);
    }
  };

  const handleClose = () => {
    setSelectedTrackSids([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="xs">
      <DialogTitle>Recording Controls</DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText>Choose what to record: </DialogContentText>
        <FormGroup>
          {participants.map(participant => {
            return (
              <React.Fragment key={participant.identity}>
                <p>{participant.identity}</p>
                {[...participant.audioTracks.values()].map(track => {
                  return (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedTrackSids.includes(track.trackSid)}
                          onChange={(_, checked) => handleChange(track.trackSid, checked)}
                          id={track.trackSid}
                          key={track.trackSid}
                        />
                      }
                      id={'Audio'}
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
                          id={track.trackSid}
                          key={track.trackSid}
                        />
                      }
                      id={'Video'}
                      label={'Video'}
                    />
                  );
                })}
                {/* TODO: Screenshare */}
              </React.Fragment>
            );
          })}
        </FormGroup>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="contained" autoFocus>
          Cancel
        </Button>
        <Button
          onClick={() => {
            console.log('Selected track Sids: ', selectedTrackSids);
            const rules: RecordingRules = selectedTrackSids.map(trackSid => {
              return { type: 'include', track: trackSid };
            });
            updateRecordingRules(room!.sid, rules);
            handleClose();
          }}
          color="primary"
          variant="contained"
          autoFocus
        >
          Start recording
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RecordingTrackDialog;
