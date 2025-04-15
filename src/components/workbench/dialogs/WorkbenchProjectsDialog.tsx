import React from 'react';
import { IWorkbenchProject } from '../../../services/storage/Storage';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type WorkbenchProjectsDialogProps = {
  open: boolean;
  projects: IWorkbenchProject[] | undefined;
  currentProject: IWorkbenchProject | undefined;
  onClose: () => void;
  onCreateNewProject: () => void;
  onOpenProject: (project: IWorkbenchProject) => void;
  onDeleteProject: (project: IWorkbenchProject) => void;
};

export default function WorkbenchProjectsDialog(
  props: WorkbenchProjectsDialogProps
) {
  return (
    <Dialog open={props.open} maxWidth="sm" fullWidth>
      <DialogTitle>Projects</DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%', maxheight: '50vh', boxSizing: 'border-box' }}>
          <List>
            {props.projects !== undefined &&
              props.projects.map((project) => (
                <ListItem
                  key={`projects-dialog-${project.id}`}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => props.onDeleteProject(project)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton onClick={() => props.onOpenProject(project)}>
                    <ListItemText primary={project.name} />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCreateNewProject}>Create New</Button>
        <Button onClick={props.onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
