import {createAsyncAction, createStandardAction} from "typesafe-actions";
import {PrintJob} from "./models";

export const addJob = createStandardAction('ADD_PRINTJOB')<PrintJob>();

export const removeJob = createStandardAction('REMOVE_PRINTJOB')<string>();

export const loadJobsAsync = createAsyncAction(
    'LOAD_PRINTJOBS_REQUEST',
    'LOAD_PRINTJOBS_SUCCESS',
    'LOAD_PRINTJOBS_FAILURE'
)<void, PrintJob[], string>();

export const saveJobsAsync = createAsyncAction(
    'SAVE_PRINTJOBS_REQUEST',
    'SAVE_PRINTJOBS_SUCCESS',
    'SAVE_PRINTJOBS_FAILURE'
)<void, void, string>();
