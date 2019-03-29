import { MesureModule } from './mesure.module';

describe('MesureModule', () => {
   let blackPageModule: MesureModule;

   beforeEach(() => {
      blackPageModule = new MesureModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});