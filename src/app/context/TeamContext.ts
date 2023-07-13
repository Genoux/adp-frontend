import React from 'react';
import { Database } from '../types/supabase';

type Team = Database["public"]["Tables"]["teams"]["Row"]

const TeamContext = React.createContext<Team | null>(null);

export default TeamContext;