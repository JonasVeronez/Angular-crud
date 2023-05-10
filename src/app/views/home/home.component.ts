import { Component, ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { ElementDialogComponent } from 'src/app/shared/element-dialog/element-dialog.component';
import { MatTable } from '@angular/material/table';
import { PeriodicElement } from 'src/app/models/PeriodicElement';
import { PeriodicElementService } from 'src/app/services/periodicElement.service';





@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [PeriodicElementService]
})
export class HomeComponent {
  @ViewChild(MatTable)
  table!: MatTable<any>;
  displayedColumns: string[] = ['id','position', 'name', 'weight', 'symbol','actions'];
  dataSource!: PeriodicElement[];

  constructor(
    public dialog: MatDialog,
    public periodicElementService: PeriodicElementService 
    ) {
      this.periodicElementService.getElements()
       .subscribe((data: PeriodicElement[]) =>{
        console.log(data);
        console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');
        this.dataSource = data;

       });

    }

  ngOnInit(): void{
    
  }

  openDialog(element: PeriodicElement | null): void {
      const dialogRef = this.dialog.open(ElementDialogComponent, {
        width: '250px',
        data: element === null ? {
          id: null,
          position: null,
          name: '',
          weight: null,
          symbol: ''

        }: {  
          id: element.id,
          position: element.position,
          name: element.name,
          weight: element.weight,
          symbol: element.symbol
        }
        
      });
      
  
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined)
        if (this.dataSource.map(p => p.id).includes(result.id)){
          this.periodicElementService.editElements(result)
            .subscribe((data: PeriodicElement)=>{
              const index = this.dataSource.findIndex(p => p.id === data.id);
              this.dataSource[index] = result;
              this.table.renderRows();
          });

        }else{
          this.periodicElementService.creatElements(result)
            .subscribe((data: PeriodicElement )=> {
              this.dataSource.push(result);
              this.table.renderRows();
              
          this.periodicElementService.getElements()
              .subscribe((data: PeriodicElement[]) =>{
               console.log(data);
               this.dataSource = data;
               this.table.renderRows();
       
              });

            });


        
            



        }

      });
    }


    editElement(element: PeriodicElement): void {
      this.openDialog(element)
    }
  
    deleteElement(id: number): void {
      this.periodicElementService.deleteElements(id)
        .subscribe(() =>{
          this.dataSource = this.dataSource.filter(p => p.id !== id);

        })


    }
  
}
