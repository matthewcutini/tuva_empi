import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Tab } from '@/components/nav';
import { Switch } from '@/components/ui/switch';
import { LoaderCircle } from 'lucide-react';
import { RecordManager } from '@/components/person_match/RecordManager';
import { PersonList } from '@/components/person_match/PersonList';
import { useAppStore } from '@/providers/app_store_provider';
import { getRoute, Route } from '@/lib/routes';

const PersonMatchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const matchMode = useAppStore((state) => state.personMatch.matchMode);
  const selectedPotentialMatchId = useAppStore(
    (state) => state.personMatch.selectedPotentialMatchId
  );
  const selectedPersonId = useAppStore(
    (state) => state.personMatch.selectedPersonId
  );
  const setMatchMode = useAppStore((state) => state.personMatch.setMatchMode);
  const selectSummary = useAppStore((state) => state.personMatch.selectSummary);
  const fetchDataSources = useAppStore(
    (state) => state.personMatch.fetchDataSources
  );
  const fetchSummaries = useAppStore(
    (state) => state.personMatch.fetchSummaries
  );
  const fetchPotentialMatch = useAppStore(
    (state) => state.personMatch.fetchPotentialMatch
  );
  const fetchPerson = useAppStore((state) => state.personMatch.fetchPerson);
  const [loading, setLoading] = useState(true);

  // Set state based on page query parameters
  useEffect(() => {
    const resourceIdParam = searchParams.get('id');
    const matchModeParam = searchParams.get('matchMode') === 'true';

    fetchDataSources();
    fetchSummaries();
    setMatchMode(matchModeParam);

    if (resourceIdParam) {
      selectSummary(resourceIdParam);
      if (matchModeParam) {
        fetchPotentialMatch(resourceIdParam);
      } else {
        fetchPerson(resourceIdParam);
      }
    }
  }, [
    searchParams,
    fetchDataSources,
    fetchSummaries,
    setMatchMode,
    selectSummary,
    fetchPotentialMatch,
    fetchPerson,
  ]);

  // We don't want the matchMode switch to toggle from off to on so we don't display the page
  // until the state has been set correctly from the URL params.
  useEffect(() => {
    const matchModeParam = searchParams.get('matchMode') === 'true';
    if (matchMode === matchModeParam) {
      setLoading(false);
    }
  }, [searchParams, matchMode]);

  return (
    <div className="flex flex-col w-full h-full">
      <NavBar selectedTab={Tab.personMatch} />
      {loading ? (
        <div className="flex flex-row items-center justify-center h-full w-full">
          <LoaderCircle className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="w-full h-[92px] border-b-[1px] border-muted-foreground flex flex-row justify-between items-center pt-5 p-6">
            <h1 className="text-foreground scroll-m-20 text-[32px] font-extrabold tracking-tight">
              Person Match
            </h1>
            <div className="flex flex-row gap-2 items-center p-3 pr-5 bg-light-blue rounded-[64px]">
              <Switch
                id="match-mode"
                checked={matchMode ?? false}
                onCheckedChange={(checked: boolean) => {
                  setMatchMode(checked);

                  const params: { matchMode?: string; id?: string } = {};

                  if (checked) {
                    params.matchMode = 'true';

                    if (selectedPotentialMatchId) {
                      params.id = selectedPotentialMatchId;
                    }
                  } else {
                    if (selectedPersonId) {
                      params.id = selectedPersonId;
                    }
                  }

                  navigate(getRoute(Route.personMatch, undefined, params), {
                    replace: false,
                  });
                }}
              />
              <span className="text-sm">Match Mode</span>
            </div>
          </div>
          <div className="flex flex-row px-6 h-full w-full overflow-hidden">
            <PersonList />
            <RecordManager />
          </div>
        </>
      )}
    </div>
  );
};

export default PersonMatchPage;

