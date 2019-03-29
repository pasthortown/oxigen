import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MesureComponent } from './mesure.component';

describe('MesureComponent', () => {
   let component: MesureComponent;
   let fixture: ComponentFixture<MesureComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [MesureComponent]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(MesureComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});