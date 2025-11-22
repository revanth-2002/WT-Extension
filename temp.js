async linkedinScrape(page,url,num)
  {
    // const isThere=await GoogleLinkedinProfiles.findOne({url:url});
    // if(isThere)
    // {
    //   console.log('ok bye');
    //   return ;
    // }
    //console.log(isThere);

    //await this.#adapter.delay(1000);
    await this.delay(1000);

    console.log('you are at index-----',num);
    let cross;
    try{
    await page.waitForSelector('div.modal__overlay > section > button',{timeout:10000}).catch(() => {
      console.log("linkedin cross:", "Div Not Found");
      //page.goBack();
      //return;
    });
    cross=await page.$('div.modal__overlay > section > button');
   }catch(err){
      
   }
   if(cross)
   {
    await cross?.click();
    await this.delay(2000);
   }

    let data={};
    const name=await page.$('section.artdeco-card > div.ph5 > div.mt2 > div > div > span > a > h1');
    const Name=await (await name?.getProperty('textContent'))?.jsonValue();
    const cleanName=Name?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

    data['Name']=cleanName;
    //console.log(cleanName);
    const title_card=await page.$('section.artdeco-card > div.ph5 > div.mt2 > div > div.text-body-medium');
    const Title_cards=await (await title_card?.getProperty('textContent'))?.jsonValue();
    const cleanTitle_cards=Title_cards?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

    data['Title_cards']=cleanTitle_cards;
    const location=await page.$('section.artdeco-card > div.ph5 > div.mt2 > div > span.text-body-small.break-words');
    const Location=await (await location?.getProperty('textContent'))?.jsonValue();
    const cleanLocation=Location?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

    data['Location']=cleanLocation;
    // const curPosition = await page.$('section.artdeco-card > div.ph5 > div.mt2 > ul > li > button > span > div');
    // const CurPosition= await (await curPosition?.getProperty('textContent'))?.jsonValue();
    // const curPositionUrl=await (await curPosition?.getProperty('href'))?.jsonValue();
    // const cleanCurPosition=CurPosition?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

    // data['CurrentPosition']=cleanCurPosition;
    // data['CurrentPositionUrl']=curPositionUrl;

    // const collegeTitle = await page.$('div.top-card-layout__entity-info--right-column > div.top-card__links-container > div[data-section="educationsDetails"] > a');
    // const CollegeTitle= await (await collegeTitle?.getProperty('textContent'))?.jsonValue();
    // const collegeTitleUrl=await (await collegeTitle?.getProperty('href'))?.jsonValue();
    // const cleanCollegeTitle=CollegeTitle?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

    // data['CollegeTitle']=cleanCollegeTitle;
    // data['CollegeTitleUrl']=collegeTitleUrl;
    const about=await page.$('section.artdeco-card > div.display-flex > div > div > div > span.visually-hidden');
    const About=await (await about?.getProperty('textContent'))?.jsonValue();
    const cleanAbout=About?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

    data['About']=cleanAbout;
    const explist=await page.$$('section.artdeco-card > div > ul > li');
    const exps=[];
    //console.log(explist.length);
    for(let exp of explist)
    {
       let texp=exp;
       let isgroup=await exp.$$('div > div.pvs-entity__sub-components > ul > li' );
       for(let ig of isgroup){
        if(isgroup.length >1){
          texp=ig;
        }
        else{
          texp=exp;
        }
       const exptitle=await texp.$('div > div.display-flex > div > a > div > div > div >div >span.visually-hidden');
       const expTitle=await (await exptitle?.getProperty('textContent'))?.jsonValue();
       const cleanexpTitle=expTitle?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

       const expcompany=await texp.$('div > div.display-flex > div > a > span.t-normal > span.visually-hidden');
       const expcompanyurl=await texp.$('div > div.display-flex > div > a');
       const expCompany=await (await expcompany?.getProperty('textContent'))?.jsonValue();
       const cleanexpCompany=expCompany?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

       const expCompanyUrl=await (await expcompanyurl?.getProperty('href'))?.jsonValue();

       const expmore = await texp.$$('div > div.display-flex > div > a > span.t-black--light > span.visually-hidden');
       const expYears = await (await expmore[0]?.getProperty('textContent'))?.jsonValue();
       const expLocation=await (await expmore[1]?.getProperty('textContent'))?.jsonValue();
       const cleanexpLocation=expLocation?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines
       const cleanexpYears=expYears?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

       const expdesc=await texp.$('div > div.pvs-entity__sub-components > ul > li > div > ul > li > div > div >div > div > span.visually-hidden');
       let expDesc='';
       expDesc=await (await expdesc?.getProperty('textContent'))?.jsonValue();
       const cleanexpDesc=expDesc?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

       exps.push({title:cleanexpTitle,company:cleanexpCompany,comppanyurl:expCompanyUrl,total_years:cleanexpYears,location:cleanexpLocation,description:cleanexpDesc});
      }
    }
    //data['experience']=exps;
    const expgroup=await page.$$('section.profile > section.experience > div > ul > li.experience-group > ul > li');
    //console.log(expgroup.length);
    for(let exp of expgroup)
    {
       const exptitle=await exp.$('div> h3');
       const expTitle=await (await exptitle?.getProperty('textContent'))?.jsonValue();
       const cleanexpTitle=expTitle?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

       const expcompany=await exp.$('div > h4 > a');
       const expCompany=await (await expcompany?.getProperty('textContent'))?.jsonValue();
       const cleanexpCompany=expCompany?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

       const expCompanyUrl=await (await expcompany?.getProperty('href'))?.jsonValue();

       const expmore = await exp.$$('div > div > p');
       const expYears = await (await expmore[0]?.getProperty('textContent'))?.jsonValue();
       const expLocation=await (await expmore[1]?.getProperty('textContent'))?.jsonValue();
       const cleanexpLocation=expLocation?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines
       const cleanexpYears=expYears?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

       const expdesc=await exp.$$('div > div > div > div > p');
       let expDesc='';
       if(expdesc?.length === 2)
       expDesc=await (await expdesc[1]?.getProperty('textContent'))?.jsonValue();
       else
       expDesc=await (await expdesc[0]?.getProperty('textContent'))?.jsonValue();

       const cleanexpDesc=expDesc?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

       exps.push({title:cleanexpTitle,company:cleanexpCompany,companyurl:expCompanyUrl,total_years:cleanexpYears,location:cleanexpLocation,description:cleanexpDesc});

    }
    data['experience']=exps;
    const edus=[];
    const edulist=await page.$$('section.profile > section.education > div > ul > li');
    for(let edu of edulist)
    {
       const educollege= await edu.$('div > h3');
       const educollegeurl=await edu.$('div > h3 > a');
       const eduCollege=await (await educollege?.getProperty('textContent'))?.jsonValue();
       const cleaneduCollege=eduCollege?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

       const eduCollegeUrl=await (await educollegeurl?.getProperty('href'))?.jsonValue();
       
       const educourse= await edu.$$('div > h4 > span');
       const eduCourse = await (await educourse[0]?.getProperty('textContent'))?.jsonValue();
       const cleaneduCourse=eduCourse?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

       let eduStream='';
       let eduPercentileOrCgpa='';
       if(educourse.length === 3)
       {
          eduStream=await (await educourse[1]?.getProperty('textContent'))?.jsonValue();
          eduPercentileOrCgpa = await (await educourse[2]?.getProperty('textContent'))?.jsonValue();
       }
       else
       {
         eduPercentileOrCgpa = await (await educourse[1]?.getProperty('textContent'))?.jsonValue();
       }
       const cleaneduStream=eduStream?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines
       const cleaneduPercentileOrCgpa=eduPercentileOrCgpa?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

       const eduyears=await edu.$('div > div');
       const eduYears = await (await eduyears?.getProperty('textContent'))?.jsonValue();
       const cleaneduYears=eduYears?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

       edus.push({college:cleaneduCollege,course:cleaneduCourse,collegeurl:eduCollegeUrl,stream:cleaneduStream,cgpaOrpercentile:cleaneduPercentileOrCgpa,total_years:cleaneduYears,});
    }
     data['education']=edus;
     const certis=[];
    const cerlist=await page.$$('section.profile > section.certifications > div > ul > li');
    for(let cer of cerlist)
    {
       const certitle=await cer.$('div > h3');
       const cerTitle=await (await certitle?.getProperty('textContent'))?.jsonValue();
       const cleancerTitle=cerTitle?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

       const cerissuedby=await cer.$('div > h4');
       const cerIssuedBy=await (await cerissuedby?.getProperty('textContent'))?.jsonValue();
       const cleancerIssuedBy=cerIssuedBy?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

       const cerissuedon=await cer.$('div > div');
       const cerIssuedOn=await (await cerissuedon?.getProperty('textContent'))?.jsonValue();
       const cleancerIssuedOn=cerIssuedOn?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

       certis.push({title:cleancerTitle,issuedBy:cleancerIssuedBy,issuedOnDate:cleancerIssuedOn});
    }
    data['certificates']=certis;

    const volexp=[];
    const vollist = await page.$$('section.profile > section.volunteering > div > ul > li');

    for(let vol of vollist)
    {
      const voltitle=await vol.$('div> h3');
      const volTitle=await (await voltitle?.getProperty('textContent'))?.jsonValue();
      const cleanvolTitle=volTitle?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

      const volcompany=await vol.$('div> h4 > a');
      const volCompany=await (await volcompany?.getProperty('textContent'))?.jsonValue();
      const cleanvolCompany=volCompany?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

      const volCompanyUrl=await (await volcompany?.getProperty('href'))?.jsonValue();
   
      const volmore = await vol.$('div > div > p');
      const volYears = await (await volmore?.getProperty('textContent'))?.jsonValue();
      const cleanvolYears=volYears?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

      volexp.push({title:cleanvolTitle,company:cleanvolCompany,companyurl:volCompanyUrl,years:cleanvolYears});
      //const expLocation=await (await expmore[1]?.getProperty('textContent'))?.jsonValue();
    }
    
    data['volunatry_Experience']=volexp;

    const pros=[];
    const prolist=await page.$$('section.profile > section.projects > div > ul > li.profile-section-card');

    for(let pro of prolist)
    {
       const protitle=await pro.$('div> h3');
       const protitleurl=await pro.$('div > h3 > a');
       const proTitle=await (await protitle?.getProperty('textContent'))?.jsonValue();
       const cleanproTitle= proTitle?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

       const protitleUrl=await (await protitleurl?.getProperty('href'))?.jsonValue();
       
       const proyears=await pro.$('div> h4');
       const proYears=await (await proyears?.getProperty('textContent'))?.jsonValue();
       const cleanproYears= proYears?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines

       const prodesc=await pro.$$('div > div > div > p');
       let proDesc='';
       if(prodesc.length === 2)
       proDesc=await (await prodesc[1]?.getProperty('textContent'))?.jsonValue();
       else
       proDesc=await (await prodesc[0]?.getProperty('textContent'))?.jsonValue();

      const cleanproDesc= proDesc?.replace(/[\n\r\t]+/g, '\n').replace(/[ ]{2,}/g, ' ').split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');                           // Join cleaned lines
       pros.push({title:cleanproTitle,projectUrl:protitleUrl,years:cleanproYears,description:cleanproDesc});
    }
    data['projects']=pros;
    console.log(data);
    
    
    //await this.delay(1000000);

    // console.log('\n - - - - - - - - -  LOGIN END  - - - - - - - - - -');
    return ;
  }