import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useState } from 'react';
import { Table } from 'react-bootstrap';
import './App.css';

function App() {
	const [queryParams, setQueryParams] = useState({
		page: 1,
		pageSize: 10,
		q: '',
		sort: 'date',
	});

	const [resp, setResp] = useState(null);

	function fetchData(queryParams) {
		var url = new URL('https://api.ejobs.ro/jobs');
		url.search = new URLSearchParams(queryParams).toString();
		fetch(url.toString())
			.then((res) => res.json())
			.then((response) => setResp(response.jobs))
			.catch((e) => console.log(0, e));
	}

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
			<Button onClick={() => fetchData(queryParams)}>Apasa !</Button>
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
										{rowName.search('Date') > -1
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
