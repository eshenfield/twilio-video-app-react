import React, { PropsWithChildren, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import FormGroup from '@material-ui/core/FormGroup';
import ParticipantTrackList from './ParticipantTrackList/ParticipantTrackList';

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
  const localParticipant = room!.localParticipant;
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
          <ParticipantTrackList
            participant={localParticipant}
            handleChange={handleChange}
            selectedTrackSids={selectedTrackSids}
            key={localParticipant.identity}
          />
          {participants.map(participant => {
            return (
              <ParticipantTrackList
                participant={participant}
                handleChange={handleChange}
                selectedTrackSids={selectedTrackSids}
                key={participant.identity}
              />
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
            console.log('Selected track SIDs: ', selectedTrackSids);
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
