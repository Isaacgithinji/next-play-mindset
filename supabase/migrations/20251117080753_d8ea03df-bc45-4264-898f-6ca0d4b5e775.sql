-- Enable realtime for journal_entries table
ALTER TABLE public.journal_entries REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.journal_entries;

-- Enable realtime for conversations table
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;