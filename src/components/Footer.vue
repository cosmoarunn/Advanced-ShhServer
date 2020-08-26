<template>
<div style="bottom:0">
  <b-container>
    <b-row  class="mt-4"> 
      <b-col cols="8" class="text-left"> 
        <b-button-group >
          <b-button pill :pressed="false" variant="outline-success"  class="m-2" size="sm">Home</b-button>
          <b-button pill :pressed="false" variant="outline-success" class="m-2" size="sm">Github</b-button>
          <b-button pill :pressed="false" variant="outline-success" class="m-2" size="sm">StackOverflow</b-button>
        </b-button-group>
      </b-col>
      <b-col cols="4" class="text-right"> 
      <b-button  variant="outline-success" size="sm">Help</b-button>
      </b-col>
    </b-row>
  </b-container> 
</div>
</template>

