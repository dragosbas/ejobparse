import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useState } from 'react';
import { Table } from 'react-bootstrap';
import './App.css';
import { Link } from 'react-router-dom'

const CODURISV = {
	'DJ': 16,
	'MH': 18,
	'VL': 28,
	'OT': 73,
	'GJ': 69,
}

// filters.careerLevels=10

function App() {
	const [queryParams, setQueryParams] = useState({
		page: 1,
		pageSize: 100,
		q: '',
		sort: 'date',
	});

	const [counties, setCounties] = useState([`DJ`, `MH`, `VL`, `OT`, `GJ`])

	function toggleCounties(county) {
		const result = [...counties]
		const index = counties.indexOf(county)
		if (index === -1) result.push(county)
		else result.splice(index, 1)
		setCounties(result)
	}

	const [resp, setResp] = useState(null);

	function fetchData() {
		var url = new URL('https://api.ejobs.ro/jobs');
		const searchParams = new URLSearchParams(queryParams)
		searchParams.append('filters.careerLevels', 10)

		counties.forEach(county => Object.keys(CODURISV).indexOf(county) > -1 && searchParams.append(`filters.cities`, CODURISV[county]))

		url.search = searchParams.toString();
		fetch(url.toString())
			.then((res) => res.json())
			.then((response) => setResp(response.jobs))
			.catch((e) => console.log(0, e));
	}

	// useEffect(() => fetchData(), [])

	var rowNames = new Set();

	resp &&
		resp.forEach((element) => {
			Object.keys(element).forEach((individualKey) =>
				rowNames.add(individualKey)
			);
		});

	const handleChange = (event) => {
		setQueryParams({ ...queryParams, [event.target.id]: event.target.value });
		console.log(queryParams);
	};

	const TableData = [];
	let currentPos = [];
	resp &&
		resp.forEach((position) => {
			currentPos = [];
			rowNames.forEach((rowName) => currentPos.push(position[rowName]));
			TableData.push(currentPos);
		});
	console.log(TableData);
	console.log(counties)
	return (
		<div className="App">
			<Card style={{ marginTop: "25px" }}>
				<Card.Body>
					<Row>
						<Col>
							<Form>
								<Form.Group className="mb-3" controlId="page">
									<Form.Label>Page No</Form.Label>
									<Form.Control
										type="text"
										value={queryParams.page}
										onChange={handleChange}
									/>
									<Form.Text className="text-muted"></Form.Text>
								</Form.Group>
							</Form>
						</Col>

						<Form>
							<Col>
								<Form.Group className="mb-3" controlId="pageSize">
									<Form.Label>Number of Results/Page</Form.Label>
									<Form.Control
										type="number"
										value={queryParams.pageSize}
										onChange={handleChange}
									/>
									<Form.Text className="text-muted"></Form.Text>
								</Form.Group>
							</Col>
							<Form.Group className="mb-3" controlId="q">
								<Form.Label>Search String</Form.Label>
								<Form.Control
									type="text"
									value={queryParams.q}
									onChange={handleChange}
								/>
								<Form.Text className="text-muted"></Form.Text>
							</Form.Group>
							<Form.Group className="mb-3" controlId="sort">
								<Form.Label>Sorting Style</Form.Label>
								<Form.Select value={queryParams.sort} onChange={handleChange}>
									<option>suitability</option>
									<option>date</option>
								</Form.Select>
								<Form.Text className="text-muted"></Form.Text>
							</Form.Group>
						</Form>
						{Object.keys(CODURISV).map(key =>
							<Col>
							<Button id="tbg-btn-1" value={key} key={key} onClick={() => toggleCounties(key)} variant={counties.indexOf(key) === -1 ? "secondary" : "primary"}>
								{key}
							</Button>
							</Col>
						)}
						<Row>_</Row>
						<Button onClick={() => fetchData()}>Apasa !</Button>
					</Row>
				</Card.Body>
				<Card.Body>
					{resp ? (
						<Table striped bordered hover>
							<thead>
								<tr>
									{Array.from(rowNames).map((rowName, index) => (
										<td key={index}>{rowName}</td>
									))}
								</tr>
							</thead>
							<tbody>
								{TableData.map((row, index) => (
									<tr key={index}>
										{Array.from(rowNames).map((rowName, index) => (
											<td key={index}>
												{rowName.search('id') !== -1 ?
													<Link to={`/anunt/${JSON.stringify(row[index])}`}>{row[index]}</Link>
													: rowName.search('Date') > -1
														? new Date(Date.parse(row[index])).toLocaleString()
														: JSON.stringify(row[index])}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</Table>
					) : (
						<p>Astept sa apesi...</p>
					)}

				</Card.Body>
			</Card>
		</div>
	);
}

export default App;
