/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { parse } from 'papaparse'
import { Timestamp } from 'firebase/firestore'


// @mui
import Stack from '@mui/material/Stack';
// components
import { MultiFilePreview, UploadBox } from 'src/components/upload';
import { addEmployee } from 'src/db/dbQueryFirestore';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  attachments: string[];
};

export default function KanbanDetailsAttachments({ attachments }: Props) {
  const [files, setFiles] = useState<(File | string)[]>(attachments);
  const { user } = useAuthContext();

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log(acceptedFiles);
      const newFiles = acceptedFiles.map((file: File) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }))    
      setFiles([...files, ...newFiles]);


      parse(acceptedFiles[0], {
        header: true,
        // download: true,
        async complete (input:any) {
          const records = input.data

      const clean1 = records.filter((row: any) => row['Given name (first name)'] !== '')
          clean1.map(async (dRow:any) => {
        console.log('inside this')
        const date:any = new Date(dRow['Join date'])
        const milliseconds = date.getTime() + 21600000 
        const dRow1:any = {};
        dRow1.join_date = milliseconds
        dRow1.aadhar_no = dRow['Aadhar number'] ||  "NA"
        dRow1.bank_account_no = dRow['Bank account number'] ||  "NA"
        dRow1.bank_name = dRow['Bank name'] ||  "NA"
        dRow1.blood_group = dRow['Blood group']||  "NA"
        dRow1.child1_dob = dRow['Child 1 date of birth']||  "NA"
        dRow1.child1_name = dRow['Child 1 name']||  "NA"
        dRow1.child1_gender = dRow['Child 1gender']||  "NA"
        dRow1.child2_dob = dRow['Child 2 date of birth']||  "NA"
        dRow1.child2_name = dRow['Child 2 gender']||  "NA"
        dRow1.child2_gender = dRow['Child 2 name']||  "NA"
        dRow1.communication_address = dRow['Communication address']||  "NA"
        dRow1.company = dRow?.Company ||  "NA"
        dRow1.company_email = dRow['Company email address']||  "NA"
        dRow1.company_mobiles = dRow['Company mobiles'] ||  "NA"
        dRow1.current_projects = dRow['Current Project']||  "NA"
        dRow1.department = dRow?.Department||  "NA"
        dRow1.dependent_spouse_name = dRow['Dependent spouse name']||  "NA"
        dRow1.designation = dRow?.Designation||  "NA"
        dRow1.emergency_ph_no = dRow['Emergency contact number']||  "NA"
        dRow1.emergency_ph_name = dRow['Emergency contact person name']||  "NA"
        dRow1.emp_dob = dRow['Employee date of birth'] ||  "NA"
        dRow1.emp_gender = dRow['Employee gender']||  "NA"
        dRow1.emp_id = dRow['Employee id']||  "NA"
        dRow1.exit_date = dRow['Exit Date']||  "NA"
        dRow1.lastname = dRow['Family name (last name)']||  "NA"
        dRow1.father_dob = dRow['Father date of birth']||  "NA"
        dRow1.father_name = dRow['Father name']||  "NA"
        dRow1.first_name = dRow['Given name (first name)']||  "NA"
        dRow1.ifsc_code = dRow['IFSC code']||  "NA"
        dRow1.maritual_status = dRow['Marrital status']||  "NA"
        dRow1.mother_dob = dRow['Mother date of birth']||  "NA"
        dRow1.mother_name = dRow['Mother name']||  "NA"
        dRow1.ssc_name = dRow['Name ( As Per SSC Marks Memo )']||  "NA"
        dRow1.pan_no = dRow['PAN number']||  "NA"
        dRow1.passort_no = dRow['Passport number']||  "NA"
        dRow1.personal_email = dRow['Personal email address']||  "NA"
        dRow1.personal_mobile_no = dRow['Personal mobile number']||  "NA"
        dRow1.permanent_address = dRow['Premanent address']||  "NA"
        dRow1.pervious_projectsA = dRow['Previous Projects in Ensar']||  "NA"
        dRow1.qualification = dRow?.Qualification||  "NA"
        dRow1.referred_person_name = dRow['Referred person name']||  "NA"
        dRow1.reimbursement_start_date = dRow['Reimbursement start date']||  "NA"
        dRow1.reporting_to = dRow['Reporting To']||  "NA"
        dRow1.spouse_dob = dRow['Spouse date of birth']||  "NA"
        dRow1.spouse_gender = dRow['Spouse gender']||  "NA"
        dRow1.status = dRow?.Status||  "NA"
        dRow1.uan_no = dRow['UAN number']||  "NA"
        dRow1.CT = Timestamp.now().toMillis()
        await addEmployee(user?.orgId, dRow1, user?.email)
        return dRow1
       
      })
      
      console.log('logs', clean1)     
       }   })


    },
    [files]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = files.filter((file) => file !== inputFile);
      setFiles(filtered);
    },
    [files]
  );

  useEffect(() => {
    files.map((e1)=>{
      //       const content = e1.target.result;
          // You can process the CSV content here, e.g., parse it into an array of objects
          console.log('content is ', e1)
          return e1
      })
  }, [files])
  

  return (
    <Stack direction="row" flexWrap="wrap">
      <MultiFilePreview
        thumbnail
        files={files}
        onRemove={(file) => handleRemoveFile(file)}
        sx={{ width: 64, height: 64 }}
      />

      <UploadBox onDrop={handleDrop} />
    </Stack>
  );
}
