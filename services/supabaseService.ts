
import { supabase } from '../supabaseClient';
import { ContentIdea, ScheduledContent } from '../types';

export const supabaseService = {
    // --- Ideas ---

    async saveIdea(idea: ContentIdea) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('ideas')
            .upsert({
                id: idea.id,
                user_id: user.id,
                type: idea.type,
                title: idea.title,
                hook: idea.hook,
                description: idea.description,
                caption: idea.caption,
                call_to_action: idea.callToAction,
                structure: idea.structure,
                image_url: idea.image,
                is_favorite: idea.isFavorite || false,
                is_used: idea.isUsed || false,
                is_edited: idea.isEdited || false
            });

        if (error) throw error;
    },

    async getAllIdeas(): Promise<ContentIdea[]> {
        const { data, error } = await supabase
            .from('ideas')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map((dbIdea: any) => ({
            id: dbIdea.id,
            type: dbIdea.type,
            title: dbIdea.title,
            hook: dbIdea.hook,
            description: dbIdea.description,
            caption: dbIdea.caption,
            callToAction: dbIdea.call_to_action,
            structure: dbIdea.structure,
            image: dbIdea.image_url,
            isFavorite: dbIdea.is_favorite,
            isUsed: dbIdea.is_used,
            isEdited: dbIdea.is_edited,
            createdAt: dbIdea.created_at
        }));
    },

    async deleteIdea(id: string) {
        const { error } = await supabase
            .from('ideas')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // --- Scheduled Content ---

    async saveScheduledContent(content: ScheduledContent) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('scheduled_content')
            .upsert({
                id: content.id,
                user_id: user.id,
                title: content.title,
                type: content.type,
                platform: content.platform,
                scheduled_date: content.date, // Assuming date string or ISO format matches
                status: content.status,
                content: content // Storing full object as backup in JSONB
            });

        if (error) throw error;
    },

    async getAllScheduledContent(): Promise<ScheduledContent[]> {
        const { data, error } = await supabase
            .from('scheduled_content')
            .select('*')
            .order('scheduled_date', { ascending: false });

        if (error) throw error;

        return (data || []).map((row: any) => ({
            id: row.id,
            title: row.title,
            type: row.type,
            platform: row.platform,
            date: row.scheduled_date,
            status: row.status
        }));
    },

    async updateContentStatus(id: string, status: string) {
        const { error } = await supabase
            .from('scheduled_content')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    },

    async deleteScheduledContent(id: string) {
        const { error } = await supabase
            .from('scheduled_content')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // --- Stats ---

    async getStats() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { totalIdeas: 0, totalScheduled: 0, planned: 0, pending: 0, published: 0 };

        const { count: ideasCount } = await supabase
            .from('ideas')
            .select('*', { count: 'exact', head: true });

        const { count: scheduledCount } = await supabase
            .from('scheduled_content')
            .select('*', { count: 'exact', head: true });

        const { data: statusCounts } = await supabase
            .from('scheduled_content')
            .select('status');

        const planned = statusCounts?.filter((c: any) => c.status === 'Planejado').length || 0;
        const pending = statusCounts?.filter((c: any) => c.status === 'Pendente').length || 0;
        const published = statusCounts?.filter((c: any) => c.status === 'Publicado').length || 0;

        return {
            totalIdeas: ideasCount || 0,
            totalScheduled: scheduledCount || 0,
            planned,
            pending,
            published
        };
    }
};
