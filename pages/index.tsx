import React, { useState } from 'react';
import { NextPage } from 'next';
import fetch from 'isomorphic-unfetch';
import dynamic from 'next/dynamic'
import LeftPanel from '../components/LeftPanel'
import { arraySubtraction } from '../utils/helpers'

const MapView = dynamic(() => import('../components/MapView'), { ssr: false })

export interface CountryProps {
	ID: any;
	Country: string;
	CasesPerOneMillion: number;
	Cases: number;
	TodayCases: number;
	Updated: number;
	Deaths: number;
	TodayDeaths: number;
	Recovered: number;
	Active: number;
	Critical: number;
	DeathsPerOneMillion: number;
	Tests: number;
	TestsPerOneMillion: number;
	AffectedCountries: number;
	FortnightCases: Array<number>;
	DropRate: number;
	OneWeekProjection: number;
	CountryInfo: {
		Long: number;
		Lat: number;
		Flag: string
	};
}

export interface countryPointsProps {
	id: string;
	cases: number;
	casesPerMillion: number;
	country: string;
	todayCases: number;
	updated: number;
	deaths: number;
	todayDeaths: number;
	recovered: number;
	active: number;
	critical: number;
	casesPerOneMillion: number;
	deathsPerOneMillion: number;
	tests: number;
	testsPerOneMillion: number;
	affectedCountries: number;
	flag: string;
	fortnightCases: Array<number>;
	dropRate: number;
	oneWeekProjection: number;
}

export interface HistoryProps {
	[x: string]: { [s: string]: number; } | ArrayLike<{[s: string]: number;}>;
}

interface Props {
	data: {
		updated: number;
		cases: number;
		todayCases: number;
		deaths: number;
		todayDeaths: number;
		recovered: number;
		active: number;
		critical: number;
		casesPerOneMillion: number;
		deathsPerOneMillion: number;
		tests: number;
		testsPerOneMillion: number;
		affectedCountries: number;
	},
	countries: CountryProps[];
	history: HistoryProps;
}

export const isBrowser = process.browser && true;

const Home: NextPage<Props> = (props) => {
    const activeTheme = isBrowser && parseInt(localStorage.getItem('cov-theme'), 10)

	const [state, setState] = useState({
		countryData: null,
		theme: activeTheme === 1 ? 1 : 0
	})

	const changeLeftPanelTheme = (theme: number) => {
		setState({ ...state, theme })
	}

	const getData = (countryData: countryPointsProps) => {
		setState({ ...state, countryData })
	}

	const handleHistory = (props: HistoryProps) => {
		let history = {
			fortnightCases: arraySubtraction(
				Object.values(
					props["cases"])
					.slice(1).slice(-15)
					.sort((a: number, b: number) => a - b
					))
		}
		return history
	}

	return (
		<div className="flex">
			<div className="w-1/4">
				<LeftPanel
					panelData={state.countryData || { ...handleHistory(props.history), ...props.data }}
					theme={state.theme}
				/>
			</div>
			<div className="flex-1 relative" style={{ width: '100vw', height: '100vh' }}>
				<MapView
					countriesData={props.countries}
					getData={getData}
					changeLeftPanelTheme={changeLeftPanelTheme}
					activeTheme={state.theme}
				/>
			</div>
		</div>
	);
}

Home.getInitialProps = async () => {
	const res = await fetch(process.env.GET_ALL_COUNTRIES);
	const countriesData = await fetch(process.env.GET_COUNTRIES_DATA)
	const worldHistory = await fetch(process.env.GET_WORLD_HISTORY)
	const data = await res.json();
	const countries = await countriesData.json()
	const history = await worldHistory.json()

	return { data, countries, history };
};

export default Home;
