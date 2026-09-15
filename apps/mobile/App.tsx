import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

// Points at the local Phase 1 API implementation (apps/api). Override with
// EXPO_PUBLIC_API_URL for device/simulator testing against a different host.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

interface SourceAttribution {
  id: string;
  name: string;
  website: string;
}

interface OpportunitySummary {
  id: string;
  title: string;
  organization?: string | null;
  category: string;
  deadline?: string | null;
  status: string;
  source: SourceAttribution;
}

interface OpportunityPage {
  items: OpportunitySummary[];
  hasMore: boolean;
}

export default function App() {
  const [opportunities, setOpportunities] = useState<OpportunitySummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE_URL}/api/v1/opportunities`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API responded with ${res.status}`);
        }
        return res.json() as Promise<OpportunityPage>;
      })
      .then((page) => {
        if (!cancelled) {
          setOpportunities(page.items);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Oppora</Text>
      <Text style={styles.subheader}>Opportunities near you</Text>

      {loading && <ActivityIndicator style={styles.spacer} />}

      {!loading && error && (
        <Text style={styles.error}>
          Could not reach the Oppora API at {API_BASE_URL}: {error}
        </Text>
      )}

      {!loading && !error && (
        <FlatList
          style={styles.list}
          data={opportunities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              {item.organization ? <Text style={styles.org}>{item.organization}</Text> : null}
              <Text style={styles.meta}>
                {item.category} · {item.status}
                {item.deadline ? ` · due ${new Date(item.deadline).toLocaleDateString()}` : ''}
              </Text>
              <Text style={styles.source}>Source: {item.source.name}</Text>
            </View>
          )}
        />
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
  },
  subheader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  spacer: {
    marginTop: 24,
  },
  error: {
    color: '#b00020',
    marginTop: 24,
  },
  list: {
    flex: 1,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  org: {
    fontSize: 13,
    color: '#444',
  },
  meta: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  source: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
});
