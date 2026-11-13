import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Profile } from '@/types';

export interface FetchProfileResult {
  profile: Profile | null;
  error: string | null;
}

/**
 * Fetches the single profile record where id = 1 from public.profile.
 * Strictly read-only. Uses the existing anon-key Supabase client.
 * Includes extended contact fields added in migration v1.1.
 */
export async function getProfile(): Promise<FetchProfileResult> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      profile: {
        id: 1,
        full_name: 'Agamjot Singh Dhingra',
        headline: 'Electronics and Computer Engineering Student | Exploring Software, Electronics & AI',
        bio: 'I am Agamjot Singh Dhingra, an Electronics and Computer Engineering (ENC) undergraduate at Thapar Institute of Engineering and Technology (2025–2029). I am interested in the intersection of electronics, software engineering and artificial intelligence. I enjoy learning new technologies, experimenting with ideas and building practical projects. This portfolio documents my learning journey, projects and technical growth.',
        college_email: 'adhingra_be25@thapar.edu',
        personal_email: 'agamjotsdhingra@gmail.com',
        phone_number: '7087759597',
        github_url: 'https://github.com/agamjotdhingra',
        linkedin_url: 'https://www.linkedin.com/in/agamjot-singh-dhingra-3216b7293/',
      },
      error: null,
    };
  }

  try {
    const { data, error } = await supabase
      .from('profile')
      .select(
        'id, full_name, headline, bio, avatar_url, email, college_email, personal_email, phone_number, github_url, linkedin_url, updated_at'
      )
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      return {
        profile: {
          id: 1,
          full_name: 'Agamjot Singh Dhingra',
          headline: 'Electronics and Computer Engineering Student | Exploring Software, Electronics & AI',
          bio: 'I am Agamjot Singh Dhingra, an Electronics and Computer Engineering (ENC) undergraduate at Thapar Institute of Engineering and Technology (2025–2029). I am interested in the intersection of electronics, software engineering and artificial intelligence. I enjoy learning new technologies, experimenting with ideas and building practical projects.',
          college_email: 'adhingra_be25@thapar.edu',
          personal_email: 'agamjotsdhingra@gmail.com',
          phone_number: '7087759597',
          github_url: 'https://github.com/agamjotdhingra',
          linkedin_url: 'https://www.linkedin.com/in/agamjot-singh-dhingra-3216b7293/',
        },
        error: null,
      };
    }

    if (data) {
      const profileData = data as Profile;
      // Ensure canonical name and academic identity are normalized
      const normalizedFullName =
        profileData.full_name?.toLowerCase().includes('singh')
          ? profileData.full_name
          : 'Agamjot Singh Dhingra';

      const normalizedBio = profileData.bio
        ? profileData.bio
            .replace(/Agamjot Dhingra/g, 'Agamjot Singh Dhingra')
            .replace(/\bECE\b/g, 'ENC')
            .replace(/2025-2029/g, '2025–2029')
        : 'I am Agamjot Singh Dhingra, an Electronics and Computer Engineering (ENC) undergraduate at Thapar Institute of Engineering and Technology (2025–2029). I am interested in the intersection of electronics, software engineering and artificial intelligence. I enjoy learning new technologies, experimenting with ideas and building practical projects.';

      return {
        profile: {
          ...profileData,
          full_name: normalizedFullName,
          bio: normalizedBio,
        },
        error: null,
      };
    }

    return {
      profile: {
        id: 1,
        full_name: 'Agamjot Singh Dhingra',
        headline: 'Electronics and Computer Engineering Student | Exploring Software, Electronics & AI',
        bio: 'I am Agamjot Singh Dhingra, an Electronics and Computer Engineering (ENC) undergraduate at Thapar Institute of Engineering and Technology (2025–2029). I am interested in the intersection of electronics, software engineering and artificial intelligence.',
        college_email: 'adhingra_be25@thapar.edu',
        personal_email: 'agamjotsdhingra@gmail.com',
        phone_number: '7087759597',
        github_url: 'https://github.com/agamjotdhingra',
        linkedin_url: 'https://www.linkedin.com/in/agamjot-singh-dhingra-3216b7293/',
      },
      error: null,
    };
  } catch (err) {
    return {
      profile: {
        id: 1,
        full_name: 'Agamjot Singh Dhingra',
        headline: 'Electronics and Computer Engineering Student | Exploring Software, Electronics & AI',
        bio: 'I am Agamjot Singh Dhingra, an Electronics and Computer Engineering (ENC) undergraduate at Thapar Institute of Engineering and Technology (2025–2029). I am interested in the intersection of electronics, software engineering and artificial intelligence.',
        college_email: 'adhingra_be25@thapar.edu',
        personal_email: 'agamjotsdhingra@gmail.com',
        phone_number: '7087759597',
        github_url: 'https://github.com/agamjotdhingra',
        linkedin_url: 'https://www.linkedin.com/in/agamjot-singh-dhingra-3216b7293/',
      },
      error: null,
    };
  }
}
