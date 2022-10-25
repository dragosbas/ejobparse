import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { prettyPrintJson } from 'pretty-print-json';

function Individual() {
	let { id } = useParams();
	const jsonToTable = require('json-to-table');

	const [resp, setResp] = useState(null);
	useEffect(() => {
		var url = new URL(`https://api.ejobs.ro/jobs/${id}`);
		url.search = new URLSearchParams({ viewedFromMobile: false }).toString();
		fetch(url.toString())
			.then((res) => res.json())
			.then((response) => setResp(response))
			.catch((e) => console.log(0, e));
	}, [id]);

	console.log(resp);
	const TableData = jsonToTable(resp)

	return (
		<>
			<Link to="/"> Home </Link>
			{!resp ? (
				'Loading'
			) : (
					<>
					<div dangerouslySetInnerHTML={{__html:prettyPrintJson.toHtml(resp,{indent:10,lineNumbers:true})}} className={"json-container"}/>

					
				<Table striped bordered hover>
					<tbody>
					{TableData[0].map((element,index)=><tr key={index}><td>{element}</td><td>{TableData[1][index]}</td></tr>)}
					</tbody>
				</Table>
					</>
			)}
		</>
	);
}

export default Individual;
