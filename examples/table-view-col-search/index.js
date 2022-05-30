import React from 'react';
import ReactDOM from 'react-dom';
import MUIDataTable from '../../src/';

class Example extends React.Component {
  render() {
    const columns = [
      'Applicant Name',
      'Address',
      'ID',
      'Submission Number',
      'Workflow',
      'Status',
      'Launched',
      'Assigned To',
      'Progress',
      'Contacts',
      'Linked',
      'Completed',
      'City',
      'Country',
      'Long Legal',
      'Postal Code',
      'Province',
      'Roll #',
      'Short Legal',
      'Zone',
      'Parcel Area',
      'Electoral Area',
      'Provincial Linc Number',
      'Applicant Address',
      'Applicant Company Name',
      'Applicant City',
      'Applicant Email',
      'Applicant Name',
      'Applicant Phone',
      'Applicant Other Phone',
      'Applicant Postal Code',
      'Applicant Province',
      'Applicant Country',
      'Owner Address',
      'Owner Company Name',
      'Owner City',
      'Owner Email',
      'Owner Name',
      'Owner Phone',
      'Owner Other Phone',
      'Owner Postal Code',
      'Owner Province',
      'Owner Country',
      'Contractor Address',
      'Contractor Company Name',
      'Contractor City',
      'Contractor Email',
      'Contractor Name',
      'Contractor Phone',
      'Contractor Other Phone',
      'Contractor Postal Code',
      'Contractor Province',
      'Contractor Country',
    ];

    const data = [
      ['Gabby George', 'Business Analyst', 'Minneapolis'],
      ['Aiden Lloyd', 'Business Consultant', 'Dallas'],
      ['Jaden Collins', 'Attorney', 'Santa Ana'],
      ['Franky Rees', 'Business Analyst', 'St. Petersburg'],
      ['Aaren Rose', null, 'Toledo'],
    ];

    const options = {
      filter: false,
      search: false,
      print: false,
      download: false,
      viewColumns: true,
      viewColumnsSearch: true,
      customToolbar: null,
      responsive: 'vertical',
    };

    return <MUIDataTable title={''} data={data} columns={columns} options={options} />;
  }
}

export default Example;
