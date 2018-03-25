class MasterDBRouter:

    @staticmethod
    def _is_master(model):
        return model._meta.app_label == 'master'

    def db_for_read(self, model, **hints):
        return 'master' if self._is_master(model) else None

    def db_for_write(self, model, **hints):
        return 'master' if self._is_master(model) else None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'master':
            return db == 'master'
        if app_label == 'api':
            return db == 'default'
        return None
